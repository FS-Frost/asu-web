import { writable } from 'svelte/store';

export const pages: string[] = ["inicio", "acercaDe", "carteles.copiarMovimiento", "carteles.aplicarAlpha"];

const pagesKeys = <const>["inicio", "acercaDe", "carteles.copiarMovimiento", "carteles.aplicarAlpha"];

export type ActivePage = typeof pagesKeys[number];

export const defaultPage: ActivePage = "inicio";

export const activePage = writable<ActivePage>();

export function isPage(keyInput: string): keyInput is ActivePage {
    return pages.includes(keyInput);
}