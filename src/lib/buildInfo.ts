import { writable } from 'svelte/store';
import { z } from "zod";

export const BuildInfo = z.object({
    "sha": z.string().default(""),
    "ref": z.string().default(""),
    "actor": z.string().default(""),
});

export type BuildInfo = z.infer<typeof BuildInfo>;

export const buildInfoStore = writable<BuildInfo>(BuildInfo.parse({}));

export async function getBuildInfo(): Promise<BuildInfo> {
    const defaultBuildInfo = BuildInfo.parse({});
    const response = await fetch("build-info.json");
    if (!response.ok) {
        console.error(`failed to fetch build info, status ${response.status}`);
        return defaultBuildInfo;
    }

    const maybeBuildInfo = await response.json();
    const parseResult = BuildInfo.safeParse(maybeBuildInfo);
    if (!parseResult.success) {
        console.error("invalid build info", {
            parseResult,
        });
        return defaultBuildInfo;
    }

    return parseResult.data;
}


export function generateCommitLink(buildInfo: BuildInfo): string {
    return `https://github.com/${buildInfo.actor}/syncrajo-editor-plantillas/commit/${buildInfo?.sha ?? ""}`;
}

export function generateBranchLink(buildInfo: BuildInfo): string {
    return `https://github.com/${buildInfo.actor}/syncrajo-editor-plantillas/tree/${buildInfo.ref ?? ""}`;
}

export function generateActorLink(buildInfo: BuildInfo): string {
    return `https://github.com/${buildInfo.actor ?? ""}`;
}
