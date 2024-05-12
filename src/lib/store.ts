import { writable } from 'svelte/store';

export type ActivePage = "inicio" | "acercaDe" | "carteles.copiarMovimiento";

export const activePage = writable<ActivePage>("inicio");
