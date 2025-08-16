import { z } from "zod";

export const BuildInfo = z.object({
    sha: z.string().default(""),
    ref: z.string().default(""),
    actor: z.string().default(""),
    repo: z.string().default(""),
});

export type BuildInfo = z.infer<typeof BuildInfo>;

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

export function generateShortSha(sha: string): string {
    return sha.substring(0, 7);
}

export function generateCommitLink(actor: string, repo: string, sha: string): string {
    return `https://github.com/${actor}/${repo}/commit/${sha}`;
}

export function generateBranchLink(actor: string, repo: string, ref: string): string {
    return `https://github.com/${actor}/${repo}/tree/${ref}`;
}

export function generateActorLink(actor: string): string {
    return `https://github.com/${actor}`;
}
