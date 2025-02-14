import { expect, test } from "bun:test";
import { fileHasStyle, validateDialogueEnd, validateDialogueMultipleSpaces, validateDialoguePunctuation, validateDialogueStart } from "./validateSubtitles";
import * as asu from "@fs-frost/asu";

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

    text = "En serio,";
    error = validateDialogueEnd(text);
    expect(error).toBeEmpty();
});

test("dialogue punctuation", () => {
    let text = "En serio...";
    let error = validateDialoguePunctuation(text);
    expect(error).toBeEmpty();

    text = "..en serio";
    error = validateDialoguePunctuation(text);
    expect(error).not.toBeEmpty();

    text = "...en serio";
    error = validateDialoguePunctuation(text);
    expect(error).toBeEmpty();

    text = "En serio,te digo";
    error = validateDialoguePunctuation(text);
    expect(error).not.toBeEmpty();

    text = "En serio, te digo";
    error = validateDialoguePunctuation(text);
    expect(error).toBeEmpty();

    text = "En serio;te digo";
    error = validateDialoguePunctuation(text);
    expect(error).not.toBeEmpty();

    text = "En serio; te digo";
    error = validateDialoguePunctuation(text);
    expect(error).toBeEmpty();
});

test("dialogue multiple spaces", () => {
    let text = "Con  doble   espacio.";
    let error = validateDialogueMultipleSpaces(text);
    expect(error).not.toBeEmpty();

    text = "Sin doble espacio.";
    error = validateDialogueMultipleSpaces(text);
    expect(error).toBeEmpty();
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
