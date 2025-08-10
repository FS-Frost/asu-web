import { GoogleGenerativeAI, SchemaType, type GenerationConfig } from "@google/generative-ai";
import * as asu from "@fs-frost/asu";
import { trimEnd } from "./strings";
import { z } from "zod";
import type { Options } from "./gui/pages/dialogos/validarDialogosOptions";

export const SUBTITLE_MODES = ["automático", "carteles", "diálogos", "karaokes"] as const;

export const SubtitleMode = z.enum(SUBTITLE_MODES);

export type SubtitleMode = z.infer<typeof SubtitleMode>;

export type SubtitleError = {
    location: string;
    error: string;
    text: string;
    ignoreRule: string;
};

type ValidationResult = {
    errors: SubtitleError[],
    warnings: SubtitleError[],
};

export async function validateSubtitles(subtitleMode: SubtitleMode, file: asu.ASSFile, options: Options): Promise<ValidationResult> {
    const validationResult: ValidationResult = {
        errors: [],
        warnings: [],
    };

    if (subtitleMode === "carteles") {
        return validationResult;
    }

    const actualWrapStyle = file.scriptInfo.properties.get("WrapStyle") ?? "";
    const expectedWrapStyle = "0";
    if (actualWrapStyle !== expectedWrapStyle) {
        validationResult.errors.push({
            location: "Script info, wrap style",
            error: `Se esperaba "${expectedWrapStyle}", pero se encontró "${actualWrapStyle}"`,
            text: actualWrapStyle,
            ignoreRule: "",
        });
    }

    const actualScaledBorderAndShadow =
        file.scriptInfo.properties.get("ScaledBorderAndShadow") ?? "";

    const expectedScaledBorderAndShadow = "yes";
    if (actualScaledBorderAndShadow !== expectedScaledBorderAndShadow) {
        validationResult.errors.push({
            location: "Script info, scaled border and shadow",
            error: `Se esperaba "${expectedScaledBorderAndShadow}", pero se encontró "${actualScaledBorderAndShadow}"`,
            text: actualScaledBorderAndShadow,
            ignoreRule: "",
        });
    }

    const targetStyleKaraoke = "Español";
    const geminiTargetModes: SubtitleMode[] = ["diálogos", "karaokes"];
    let totalKaraokeLines = 0;
    let llmText = "";

    for (let eventIndex = 0; eventIndex < file.events.lines.length; eventIndex++) {
        const lineNumber = eventIndex + 1;
        const currentLine = file.events.lines[eventIndex];
        const actorLines = splitMultipleActorsDialogue(currentLine);
        const lineWasSplitted = actorLines.length > 1;

        for (let lineIndex = 0; lineIndex < actorLines.length; lineIndex++) {
            const line = actorLines[lineIndex];

            if (
                subtitleMode === "automático" &&
                line.effect.includes("template syl")
            ) {
                console.info(
                    `template syl detectado en línea ${lineNumber}, pasando a modo karaokes`,
                );

                subtitleMode = "karaokes";
                continue;
            }

            if (
                subtitleMode == "diálogos" &&
                line.type == asu.LINE_TYPE_COMMENT
            ) {
                continue;
            }

            if (line.content === "") {
                continue;
            }

            if (subtitleMode === "karaokes" && !line.style.toLowerCase().includes(targetStyleKaraoke.toLowerCase())) {
                continue;
            }

            if (
                subtitleMode === "karaokes" &&
                line.type !== asu.LINE_TYPE_COMMENT
            ) {
                continue;
            }

            if (subtitleMode === "karaokes" && line.effect !== "karaoke") {
                continue;
            }

            if (subtitleMode === "karaokes" && line.effect === "fx") {
                break;
            }

            const ignoreList: string[] = line.effect
                .split(" ")
                .filter((x) => x.startsWith("ignorar-"));

            if (ignoreList.includes("ignorar-linea")) {
                continue;
            }

            if (
                options.validateLineStyleExists &&
                !ignoreList.includes("ignorar-estilo") &&
                !fileHasStyle(file, line.style)
            ) {
                validationResult.errors.push({
                    location: `Línea ${lineNumber}`,
                    error: `Estilo no encontrado`,
                    text: line.style,
                    ignoreRule: "ignorar-estilo",
                });
            }

            const items = asu.parseContent(line.content);
            let text = asu.contentsToString(
                items.filter((item) => item.name === "text"),
            );

            if (options.geminiEnabled && geminiTargetModes.includes(subtitleMode)) {
                const sanitizedText = sanitizeDialogue(text);
                let llmLineNumber = lineNumber.toString();

                if (lineWasSplitted) {
                    const splitNumber = lineIndex + 1;
                    llmLineNumber += ` parte ${splitNumber}`;
                    console.log({ split: sanitizedText, lineNumber, splitNumber });
                }

                llmText += `\nLínea ${llmLineNumber}: ${sanitizedText}`;
            }

            if (options.validateTextStart && !ignoreList.includes("ignorar-inicio")) {
                const errorMessage = validateDialogueStart(text);
                if (errorMessage != null) {
                    validationResult.errors.push({
                        location: `Línea ${lineNumber}`,
                        error: errorMessage,
                        text: line.content,
                        ignoreRule: "ignorar-inicio",
                    });
                }
            }

            if (options.validateTextSpaces && !ignoreList.includes("ignorar-espacios")) {
                const errorMessage = validateDialogueMultipleSpaces(text);
                if (errorMessage != null) {
                    validationResult.errors.push({
                        location: `Línea ${lineNumber}`,
                        error: errorMessage,
                        text: line.content,
                        ignoreRule: "ignorar-espacios",
                    });
                }
            }

            if (options.validateTextEnd && !ignoreList.includes("ignorar-fin")) {
                const errorMessage = validateDialogueEnd(text);
                if (errorMessage != null) {
                    validationResult.errors.push({
                        location: `Línea ${lineNumber}`,
                        error: errorMessage,
                        text: line.content,
                        ignoreRule: "ignorar-fin",
                    });
                }
            }

            if (options.validateTextPunctuation && !ignoreList.includes("ignorar-puntuacion")) {
                const errorMessage = validateDialoguePunctuation(text);
                if (errorMessage != null) {
                    validationResult.errors.push({
                        location: `Línea ${lineNumber}`,
                        error: errorMessage,
                        text: line.content,
                        ignoreRule: "ignorar-puntuacion",
                    });
                }
            }

            if (subtitleMode === "karaokes") {
                totalKaraokeLines++;
            }
        }
    }

    if (
        options.geminiEnabled &&
        options.geminiApiKey !== "" &&
        geminiTargetModes.includes(subtitleMode)
    ) {
        console.log(llmText);
        const result = await validateSubtitleWithGemini(llmText, options.geminiModel, options.geminiApiKey);
        for (const lineResult of result.errores) {
            let line = file.events.lines[lineResult.numeroLinea - 1];
            if (line == null) {
                line = asu.generateDefaultLine();
            }

            let errorMessage = lineResult.mensajeError;
            if (errorMessage.endsWith(".")) {
                errorMessage.substring(0, errorMessage.length - 2);
            }

            validationResult.warnings.push({
                location: `Línea ${lineResult.numeroLinea}`,
                error: errorMessage,
                text: line.content,
                ignoreRule: "ignorar-llm",
            });
        }
    }

    if (subtitleMode === "karaokes" && totalKaraokeLines === 0) {
        validationResult.errors.push({
            location: `Línea ${file.events.lines.length}`,
            error: `No se encontraron líneas de karaoke con estilo "${targetStyleKaraoke}"`,
            text: "",
            ignoreRule: "",
        });
    }

    return validationResult;
}

export function splitMultipleActorsDialogue(line: asu.Line): asu.Line[] {
    const regexHasMultipleActors = /\s*-\s([^\\]+)\\N\s*-\s([^\\]+)/;
    if (!regexHasMultipleActors.test(line.content)) {
        return [line];
    }

    const matches = line.content.match(regexHasMultipleActors);
    if (matches?.length !== 3) {
        return [line];
    }

    const lines: asu.Line[] = [];
    for (let i = 1; i <= 2; i++) {
        let contentSplit = matches.at(i) ?? "";
        contentSplit = contentSplit.trim();

        const lineSplit: asu.Line = { ...line };
        lineSplit.content = contentSplit;
        lines.push(lineSplit);
    }

    return lines;
}

export function validateDialogueStart(text: string): string | null {
    if (text.startsWith("... ")) {
        return "los tres puntos van pegados";
    }

    if (text.startsWith("...")) {
        text = text.substring("...".length);
    }

    const re = /^(-\s|¡|¿|"|“)*[A-zÁÉÍÓÚáéíóú0-9ñÑ]/gm;

    if (!re.test(text)) {
        return "inicio inválido";
    }

    return null;
}

export function validateDialogueEnd(text: string): string | null {
    text = trimEnd(text, " ");
    const validSufixes: string[] = [
        ".",
        ",",
        ";",
        "...",
        "!",
        "?",
        ":",
        "~",
        "-...",
    ];

    if (!validSufixes.some((sufix) => text.endsWith(sufix))) {
        return `No tiene un fin de línea válido: ${validSufixes.map((x) => `"${x}"`).join(", ")}`;
    }

    const endsInDot = text.endsWith(".");
    const regexDot = /[^.]\.$/;
    const regexTripleDot = /[^.]\.{3}$/;

    if (endsInDot && !regexDot.test(text) && !regexTripleDot.test(text)) {
        return `Cantidad inválida de puntos finales`;
    }

    return null;
}

export function validateDialoguePunctuation(text: string): string | null {
    for (let index = 0; index < text.length; index++) {
        const targetChars: string[] = [",", ";", "."];
        const char = text[index];
        if (!targetChars.includes(char)) {
            continue;
        }

        if (index + 1 >= text.length) {
            break;
        }

        let nextChar = text[index + 1];
        if (nextChar === "\\" && text[index + 2] === "N") {
            nextChar = "\\N";
        }

        if (char === "." && nextChar == ".") {
            continue;
        }

        const isEllipsis =
            char === "." &&
            text[index - 1] === "." &&
            text[index - 2] === ".";

        if (isEllipsis) {
            continue;
        }

        const isDecimalNumber =
            (char === "." || char === ",") &&
            !Number.isNaN(Number(text[index - 1])) &&
            !Number.isNaN(Number(text[index + 1]));

        if (isDecimalNumber) {
            continue;
        }

        const allowedNextChars: string[] = [" ", "\\N"];
        if (!allowedNextChars.includes(nextChar)) {
            return "La coma (,) y el punto y coma (;) deben ser seguidos de un espacio o salto de línea";
        }
    }

    return null;
}

export function fileHasStyle(file: asu.ASSFile, styleName: string): boolean {
    return file.styles.styles.some((style) => styleName === style.name);
}

export function validateDialogueMultipleSpaces(text: string): string | null {
    if (text.includes("  ")) {
        return "hay dos espacios seguidos";
    }

    return null;
}

export function detectSubtitlesMode(fileName: string, userSubsMode: SubtitleMode): SubtitleMode {
    if (userSubsMode !== "automático") {
        return userSubsMode;
    }

    fileName = fileName.toLocaleLowerCase();

    if (fileName.includes("carteles")) {
        return "carteles";
    }

    if (fileName.includes("subs")) {
        return "diálogos";
    }

    if (fileName.includes("karaoke")) {
        return "karaokes";
    }

    return "diálogos";
}

const GeminiValidation = z.object({
    errores: z.object({
        numeroLinea: z.number().default(0),
        mensajeError: z.string().default(""),
    }).array(),
});

type GeminiValidation = z.infer<typeof GeminiValidation>;

export async function validateSubtitleWithGemini(input: string, geminiModel: string, geminiApiKey: string): Promise<GeminiValidation> {
    let rawResponse = "";

    try {
        const storeResponseEnabled = false;
        if (storeResponseEnabled) {
            const rawStoredResponse = localStorage.getItem("geminiValidation") ?? "{}";
            if (rawStoredResponse !== "{}") {
                const storedResponse = JSON.parse(localStorage.getItem("geminiValidation") ?? "{}");
                return GeminiValidation.parse(storedResponse);
            }
        }

        const systemInstruction = `
            Valida todos los textos que recibas en busca de errores ortográficos.
            Debes ser extremadamente minucioso al detectar errores.
            Considera '\\N' como un espacio ' '.
            Ignora los espacios consecutivos, no son errores.
            Frases vulgares, de uso poco común o muletillas están bien.
        `;

        const genAI = new GoogleGenerativeAI(geminiApiKey);

        if (geminiModel == "") {
            const defaultModel = "gemini-2.0-flash";
            console.warn("empty gemini model, using default:", defaultModel);
            geminiModel = defaultModel;
        }

        const model = genAI.getGenerativeModel({
            model: geminiModel,
            systemInstruction: systemInstruction,
        });

        console.log(model.model);

        // https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/content-generation-parameters
        const generationConfig: GenerationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                required: ["errores"],
                properties: {
                    errores: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            required: ["numeroLinea", "mensajeError"],
                            properties: {
                                numeroLinea: {
                                    type: SchemaType.INTEGER,
                                    description: "número de la línea con error",
                                    example: 2,
                                },
                                mensajeError: {
                                    type: SchemaType.STRING,
                                    description: "descripción del error y consejo de cómo corregirlo",
                                },
                            },
                        },
                    },
                },
            }
        };

        const chatSession = model.startChat({
            generationConfig: generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(input);
        rawResponse = result.response.text();
        const geminiValidation = GeminiValidation.parse(JSON.parse(rawResponse));

        if (storeResponseEnabled) {
            localStorage.setItem("geminiValidation", JSON.stringify(geminiValidation));
        }

        return geminiValidation;
    } catch (error) {
        console.error("error al validar subs con gemini", error);

        if (rawResponse != "") {
            console.log("rawResponse", rawResponse);
        }

        let errorMessage = `${error}`;
        if (errorMessage.includes("API key not valid")) {
            errorMessage = "API KEY inválida.";
        }

        const geminiValidation: GeminiValidation = {
            errores: [
                {
                    numeroLinea: 0,
                    mensajeError: `Error al validar subtítulos con Google Gemini: ${errorMessage}`,
                },
            ],
        };

        return geminiValidation;
    }
}

export function sanitizeDialogue(text: string): string {
    let sanitizedText = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar1 = text[i + 1] ?? "";
        const nextChar2 = text[i + 2] ?? "";
        const nextCharNeg1 = text[i - 1] ?? "";

        if (char === "\\" && nextChar1 === "N") {
            i++;

            // "\N "
            if (nextChar2 === " ") {
                continue;
            }

            // " \N"
            if (nextCharNeg1 === " ") {
                continue;
            }

            // "\N"
            sanitizedText += " ";
            continue;
        }

        sanitizedText += char;
    }

    return sanitizedText;
}