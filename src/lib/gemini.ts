import { GoogleGenAI } from "@google/genai";
import z from "zod";

export const Model = z.object({
    name: z.string().default(""),
    description: z.string().default(""),
    displayName: z.string().default(""),
    version: z.string().default(""),
});

export type Model = z.infer<typeof Model>;

export async function getModels(geminiApiKey: string): Promise<Model[]> {
    const genAI = new GoogleGenAI({ apiKey: geminiApiKey });
    const pager = await genAI.models.list();
    const models: Model[] = [];
    let page = pager.page;

    while (true) {
        for (const model of page) {
            if (model.name == null) {
                continue;
            }

            if (!model.supportedActions?.includes("generateContent")) {
                continue;
            }

            models.push({
                name: model.name ?? "",
                displayName: model.displayName ?? "",
                description: model.description ?? "",
                version: model.version ?? "",
            });
        }

        if (!pager.hasNextPage()) {
            break;
        }

        page = await pager.nextPage();
    }

    models.sort((a, b) => {
        return (a.name + a.version).localeCompare(b.name + b.version);
    });

    return models;
}
