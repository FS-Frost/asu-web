import * as asu from "@fs-frost/asu";
import { downloadBlob } from "./utils";

export function generarSubsEjemplo(): asu.ASSFile {
    const file = asu.generateDefaultASSFile();
    file.scriptInfo.properties.set("Title", "Asu example");
    file.events.lines = [];

    const dialogues: string[] = [
        `London no sora!`,
        `London no takushii!`,
        `London no eigo!`,
        `London ni iruuuuu watashitashi!`,
    ];

    for (const dialogue of dialogues) {
        const line = asu.generateDefaultLine();
        line.actor = "Yui-chan";
        line.content = dialogue;
        file.events.lines.push(line);
    }

    return file;
}

export function descargarSubsEjemplo(): void {
    const file = generarSubsEjemplo();
    const rawFile = asu.ASSFileToString(file);

    const blob = new Blob([rawFile], {
        type: "plain/text",
    });

    downloadBlob(blob, "Ejemplo ejemplificador.ass");
}
