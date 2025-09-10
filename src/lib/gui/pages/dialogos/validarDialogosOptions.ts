import { SubtitleMode } from "$lib/validateSubtitles";
import { z } from "zod";

/** https://ai.google.dev/gemini-api/docs/rate-limits#free-tier */
export const GEMINI_MODELS = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-pro",
] as const;

export const GeminiModel = z.enum(GEMINI_MODELS);

export type GeminiModel = z.infer<typeof GeminiModel>;

export const DEFAULT_GEMINI_MODEL: GeminiModel = "gemini-2.5-flash-lite";

export const DEFAULT_GEMINI_MAX_TOKENS: number = 65536;

export const Options = z.object({
    userSubsMode: SubtitleMode.default("automático"),
    geminiEnabled: z.boolean().default(false),
    geminiApiKey: z.string().default(""),
    geminiModel: GeminiModel.default(DEFAULT_GEMINI_MODEL),
    geminiMaxTokens: z.number().default(DEFAULT_GEMINI_MAX_TOKENS),
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
