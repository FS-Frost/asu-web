import * as asu from "@fs-frost/asu";
import { trimEnd } from "./strings";

export const SUBTITLE_MODES = ["automático", "carteles", "diálogos", "karaokes"] as const;

export type SubtitleMode = (typeof SUBTITLE_MODES)[number];

export type SubtitleError = {
    location: string;
    error: string;
    text: string;
    ignoreRule: string;
};

export function validateSubtitles(subtitleMode: string, file: asu.ASSFile): SubtitleError[] {
    const subtitleErrors: SubtitleError[] = [];

    if (subtitleMode === "carteles") {
        return subtitleErrors;
    }

    const wrapStyle = file.scriptInfo.properties.get("WrapStyle") ?? "";
    const expectedWrapStyle = "0";
    if (wrapStyle !== expectedWrapStyle) {
        subtitleErrors.push({
            location: "Script info, wrap style",
            error: `Se esperaba "${expectedWrapStyle}", pero se encontró "${wrapStyle}"`,
            text: wrapStyle,
            ignoreRule: "",
        });
    }

    const scaledBorderAndShadow =
        file.scriptInfo.properties.get("ScaledBorderAndShadow") ?? "";

    const expectedScaledBorderAndShadow = "yes";
    if (scaledBorderAndShadow !== expectedScaledBorderAndShadow) {
        subtitleErrors.push({
            location: "Script info, scaled border and shadow",
            error: `Se esperaba "${expectedScaledBorderAndShadow}", pero se encontró "${scaledBorderAndShadow}"`,
            text: scaledBorderAndShadow,
            ignoreRule: "",
        });
    }

    let totalKaraokeLines = 0;

    for (let i = 0; i < file.events.lines.length; i++) {
        const line = file.events.lines[i];
        const lineNumber = i + 1;

        if (
            subtitleMode !== "karaokes" &&
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

        if (subtitleMode === "karaokes" && line.style !== "Español") {
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

        if (!fileHasStyle(file, line.style)) {
            subtitleErrors.push({
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

        if (!ignoreList.includes("ignorar-inicio")) {
            const errorMessage = validateDialogueStart(text);
            if (errorMessage != null) {
                subtitleErrors.push({
                    location: `Línea ${lineNumber}`,
                    error: errorMessage,
                    text: line.content,
                    ignoreRule: "ignorar-inicio",
                });
            }
        }

        if (!ignoreList.includes("ignorar-espacios")) {
            const errorMessage = validateDialogueMultipleSpaces(text);
            if (errorMessage != null) {
                subtitleErrors.push({
                    location: `Línea ${lineNumber}`,
                    error: errorMessage,
                    text: line.content,
                    ignoreRule: "ignorar-espacios",
                });
            }
        }

        if (!ignoreList.includes("ignorar-fin")) {
            const errorMessage = validateDialogueEnd(text);
            if (errorMessage != null) {
                subtitleErrors.push({
                    location: `Línea ${lineNumber}`,
                    error: errorMessage,
                    text: line.content,
                    ignoreRule: "ignorar-fin",
                });
            }
        }

        if (!ignoreList.includes("ignorar-puntuacion")) {
            const errorMessage = validateDialoguePunctuation(text);
            if (errorMessage != null) {
                subtitleErrors.push({
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

    if (subtitleMode === "karaokes" && totalKaraokeLines === 0) {
        subtitleErrors.push({
            location: `Línea ${file.events.lines.length}`,
            error: "No se encontraron líneas de karaoke en español",
            text: "",
            ignoreRule: "",
        });
    }

    return subtitleErrors;
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