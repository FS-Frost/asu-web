import { Model } from "$lib/gemini";
import { SubtitleMode } from "$lib/subtitleMode";
import { z } from "zod";

export const DEFAULT_GEMINI_MAX_TOKENS: number = 65536;

export const Options = z.object({
    userSubsMode: SubtitleMode.default("automático"),
    geminiEnabled: z.boolean().default(false),
    geminiApiKey: z.string().default(""),
    geminiModel: Model.default(Model.parse({})),
    geminiMaxTokens: z.number().default(DEFAULT_GEMINI_MAX_TOKENS),
    validateLineStyleExists: z.boolean().default(true),
    validateTextStart: z.boolean().default(true),
    validateTextEnd: z.boolean().default(true),
    validateTextSpaces: z.boolean().default(true),
    validateTextPunctuation: z.boolean().default(true),
    geminiInteractionsAPIEnabled: z.boolean().default(false),
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
