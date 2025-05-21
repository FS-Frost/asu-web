import { SubtitleMode } from "$lib/validateSubtitles";
import { z } from "zod";

export const DEFAULT_GEMINI_MODEL: string = "gemini-2.0-flash";

export const GEMINI_MODELS: string[] = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash-preview-05-20",
    "gemini-2.5-pro-preview-05-06",
];

export const Options = z.object({
    userSubsMode: SubtitleMode.default("automático"),
    geminiEnabled: z.boolean().default(false),
    geminiApiKey: z.string().default(""),
    geminiModel: z.string().default(DEFAULT_GEMINI_MODEL),
    validateLineStyleExists: z.boolean().default(true),
    validateTextStart: z.boolean().default(true),
    validateTextEnd: z.boolean().default(true),
    validateTextSpaces: z.boolean().default(true),
    validateTextPunctuation: z.boolean().default(true),
});

export type Options = z.infer<typeof Options>;

const keyOptions = "asu.validarDialogos.options";

export function saveOptions(options: Options): void {
    localStorage.setItem(keyOptions, JSON.stringify(options));
}

export function loadOptions(): Options {
    try {
        const rawOptions = localStorage.getItem(keyOptions) ?? "{}";
        return Options.parse(JSON.parse(rawOptions));
    } catch (error) {
        console.error("error al cargar opciones de validar diálogos", error);
        return Options.parse({});
    }
}
