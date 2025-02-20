import { SubtitleMode } from "$lib/validateSubtitles";
import { z } from "zod";

export const Options = z.object({
    userSubsMode: SubtitleMode.default("automático"),
    geminiEnabled: z.boolean().default(false),
    geminiApiKey: z.string().default(""),
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
        const rawOptions = localStorage.getItem(keyOptions) ?? "";
        return Options.parse(JSON.parse(rawOptions));
    } catch (error) {
        console.error("error al cargar opciones de validar diálogos", error);
        return Options.parse({});
    }
}
