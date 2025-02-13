import { expect, test } from "bun:test";
import { validarDobleEspacio, validarInicio } from "./validateSubtitles";

test("validar doble espacio", () => {
    let text = "Con  doble   espacio.";
    let error = validarDobleEspacio(text);
    expect(error).not.toBeEmpty();

    text = "Sin doble espacio.";
    error = validarDobleEspacio(text);
    expect(error).toBeEmpty();
});

test("validar inicio", () => {
    let text = "?En serio?";
    let error = validarInicio(text);
    expect(error).not.toBeEmpty();

    text = "¡¿En serio?!";
    error = validarInicio(text);
    expect(error).toBeEmpty();

    text = "... Dilo.";
    error = validarInicio(text);
    expect(error).not.toBeEmpty();

    text = "...Dilo.";
    error = validarInicio(text);
    expect(error).toBeEmpty();
});
