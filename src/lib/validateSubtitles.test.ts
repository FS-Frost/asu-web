import { expect, test } from "bun:test";
import { fileHasStyle, splitMultipleActorsDialogue, validateDialogueEnd, validateDialogueMultipleSpaces, validateDialoguePunctuation, validateDialogueStart, sanitizeDialogue } from "./validateSubtitles";
import * as asu from "@fs-frost/asu";

test("sanitize dialogue", () => {
    expect(sanitizeDialogue("Hola\\Nmundo")).toBe("Hola mundo");
    expect(sanitizeDialogue("Hola \\Nmundo")).toBe("Hola mundo");
    expect(sanitizeDialogue("Hola\\N mundo")).toBe("Hola mundo");
    expect(sanitizeDialogue("¿\\NEn serio?")).toBe("¿ En serio?");
});

test("dialogue multiple spaces", () => {
    let text = "Con  doble   espacio.";
    let error = validateDialogueMultipleSpaces(text);
    expect(error).not.toBeEmpty();

    text = "Sin doble espacio.";
    error = validateDialogueMultipleSpaces(text);
    expect(error).toBeEmpty();
});

test("dialogue start", () => {
    let text = "?En serio?";
    let error = validateDialogueStart(text);
    expect(error).not.toBeEmpty();

    text = "¡¿En serio?!";
    error = validateDialogueStart(text);
    expect(error).toBeEmpty();

    text = "... Dilo.";
    error = validateDialogueStart(text);
    expect(error).not.toBeEmpty();

    text = "...Dilo.";
    error = validateDialogueStart(text);
    expect(error).toBeEmpty();

    text = "“Citando algo”";
    error = validateDialogueStart(text);
    expect(error).toBeEmpty();
});

test("dialogue end", () => {
    let text = "¿En serio";
    let error = validateDialogueEnd(text);
    expect(error).not.toBeEmpty();

    text = "¿En serio?";
    error = validateDialogueEnd(text);
    expect(error).toBeEmpty();

    text = "En serio";
    error = validateDialogueEnd(text);
    expect(error).not.toBeEmpty();

    text = "En serio.";
    error = validateDialogueEnd(text);
    expect(error).toBeEmpty();

    text = "En serio..";
    error = validateDialogueEnd(text);
    expect(error).not.toBeEmpty();

    text = "En serio,";
    error = validateDialogueEnd(text);
    expect(error).toBeEmpty();

    text = "En serio~";
    error = validateDialogueEnd(text);
    expect(error).toBeEmpty();
});

test("dialogue punctuation", () => {
    let text = "En serio...";
    let error = validateDialoguePunctuation(text);
    expect(error).toBeEmpty();

    text = "..en serio";
});

test("dialogue punctuation followed by space", () => {
    expect(validateDialoguePunctuation("Hola,mundo")).not.toBeEmpty();
    expect(validateDialoguePunctuation("Hola, mundo")).toBeEmpty();
    expect(validateDialoguePunctuation("Hola.mundo")).not.toBeEmpty();
    expect(validateDialoguePunctuation("Hola. mundo")).toBeEmpty();
    expect(validateDialoguePunctuation("Llegó a las 10.30")).toBeEmpty();
    expect(validateDialoguePunctuation("Llegó a las 10,30")).toBeEmpty();
    expect(validateDialoguePunctuation("Hola\\Nmundo")).toBeEmpty();
});

test("dialogue has style", () => {
    const file: asu.ASSFile = {
        styles: {
            format: "",
            styles: [],
        },
        aegisubProjectGarbage: {
            comments: [],
            properties: new Map(),
        },
        events: {
            format: "",
            lines: [],
        },
        extraData: {
            data: [],
        },
        fonts: {
            files: [],
        },
        graphics: {
            files: [],
        },
        scriptInfo: {
            comments: [],
            properties: new Map(),
        }
    };

    let styleExists = fileHasStyle(file, "Default");
    expect(styleExists).toBeFalse();

    file.styles.styles.push(asu.generateDefaultStyle());
    styleExists = fileHasStyle(file, "Default");
    expect(styleExists).toBeTrue();
});

test("multiple actors dialogue", () => {
    const line = asu.generateDefaultLine();
    line.content = "- ¡Con permiso!\\N- ¡Kyaaaa!";
    const lines = splitMultipleActorsDialogue(line);
    expect(lines).toHaveLength(2);

    expect(lines[0].content).toBe("¡Con permiso!");
    expect(lines[1].content).toBe("¡Kyaaaa!");
});
