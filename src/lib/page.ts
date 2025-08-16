import z from 'zod';

const PAGES = [
    "inicio",
    "carteles.copiarMovimiento",
    "carteles.aplicarSecuenciaPosiciones",
    "carteles.aplicarTraslacion",
    "carteles.aplicarAlpha",
    "carteles.aplicarColor",
    "dialogos.visualizarDialogos",
    "dialogos.validarDialogos",
    "karaokes.dividirKaraoke",
    "karaokes.dividirSilabas",
    "karaokes.emparejarSilabas",
    "acercaDe",
] as const;

export const Page = z.enum(PAGES);

export type Page = z.infer<typeof Page>;
