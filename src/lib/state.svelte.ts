import z from "zod";
import { BuildInfo } from "./buildInfo";
import { Page } from "./page";

export const State = z.object({
    activePage: Page,
    buildInfo: BuildInfo,
});

export type State = z.infer<typeof State>;

export const appState = $state<State>({
    activePage: "inicio",
    buildInfo: BuildInfo.parse({}),
});

