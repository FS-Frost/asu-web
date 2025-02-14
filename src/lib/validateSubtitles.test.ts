import { expect, test } from "bun:test";
import { validateDialogueMultipleSpaces, validateDialogueStart } from "./validateSubtitles";

test("multiple spaces", () => {
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
