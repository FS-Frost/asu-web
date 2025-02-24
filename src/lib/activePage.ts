import { writable } from 'svelte/store';

const pagesKeys = <const>[
    "inicio",
    "carteles.copiarMovimiento",
    "carteles.aplicarSecuenciaPosiciones",
    "carteles.aplicarTraslacion",
    "carteles.aplicarAlpha",
    "carteles.aplicarColor",
    "dialogos.validarDialogos",
    "karaokes.dividirKaraoke",
    "karaokes.dividirSilabas",
    "acercaDe",
];

export const pages: string[] = pagesKeys.map(page => page.toString());

export type ActivePage = typeof pagesKeys[number];

export const defaultPage: ActivePage = "inicio";

export const activePageStore = writable<ActivePage>(defaultPage);

export function isPage(keyInput: string): keyInput is ActivePage {
    return pages.includes(keyInput);
}
