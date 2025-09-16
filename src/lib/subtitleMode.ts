import z from "zod";

export const SUBTITLE_MODES = ["automático", "carteles", "diálogos", "karaokes"] as const;

export const SubtitleMode = z.enum(SUBTITLE_MODES);

export type SubtitleMode = z.infer<typeof SubtitleMode>;
