import * as asu from "@fs-frost/asu";
import { detectSubtitlesMode, validateSubtitles, type SubtitleError } from "./validateSubtitles";
import type { Options } from "./gui/pages/dialogos/validarDialogosOptions";
import type { SubtitleMode } from "./subtitleMode";

export type FileResult = {
    subsType: string;
    fileName: string;
    promt: string;
    errors: SubtitleError[];
    warnings: SubtitleError[];
    errorsVisible: boolean;
    warningsVisible: boolean;
};

export type BatchValidationResult = {
    totalErrors: number;
    totalWarnings: number;
    results: FileResult[];
    scrollingText: string;
};

export async function processFiles(
    files: File[],
    options: Options,
    onFileStart?: (fileName: string) => void
): Promise<BatchValidationResult> {
    let totalErrors = 0;
    let totalWarnings = 0;
    let results: FileResult[] = [];
    let scrollingText = "";

    for (const file of files) {
        if (onFileStart) onFileStart(file.name);

        const content = await file.text();
        const assFile = asu.parseASSFile(content);
        if (assFile == null) {
            console.error("archivo inválido", file.name);
            continue;
        }

        const actualSubsMode = detectSubtitlesMode(
            file.name,
            options.userSubsMode,
        );

        const words: string[] = [];
        for (const line of assFile.events.lines) {
            const items = asu.parseContent(line.content);
            let text = asu.contentsToString(
                items.filter((item) => item.name === "text"),
            );
            text = removeChars(text, [",", ";", ".", "¡", "!", "¿", "?", "-", "\\N"]);
            const lineWords = text.split(" ");
            words.push(...lineWords);
        }

        for (let i = 1; i <= 40; i++) {
            const wordIndex = randomInt(0, words.length - 1);
            const word = words[wordIndex];
            scrollingText += " " + word;
        }

        const validationResult = await validateSubtitles(
            actualSubsMode,
            assFile,
            options,
        );

        totalErrors += validationResult.errors.length;
        totalWarnings += validationResult.warnings.length;

        results.push({
            subsType: actualSubsMode,
            fileName: file.name,
            promt: validationResult.promt,
            errors: validationResult.errors,
            warnings: validationResult.warnings,
            errorsVisible: false,
            warningsVisible: false,
        });
    }

    return {
        totalErrors,
        totalWarnings,
        results,
        scrollingText
    };
}

function removeChars(text: string, chars: string[]): string {
    for (const char of chars) {
        text = text.replaceAll(char, "");
    }
    return text;
}

function randomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
