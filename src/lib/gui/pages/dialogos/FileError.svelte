<script lang="ts">
    import type { SubtitleError } from "$lib/validateSubtitles";
    import SubsArea from "./SubsArea.svelte";

    type Props = {
        kind: "error" | "warning";
        subtitleError: SubtitleError;
    };

    let { subtitleError, kind }: Props = $props();
</script>

<span
    class="file-error {kind === 'error'
        ? 'has-text-danger'
        : 'has-text-warning'}"
>
    {kind === "error" ? "Error" : "Advertencia"}:
    {subtitleError.location}:
    {subtitleError.error + (subtitleError.error.endsWith(".") ? "" : ".")}

    {#if subtitleError.text != ""}
        <SubsArea {kind} text={subtitleError.text} rawMode={false}></SubsArea>
    {/if}

    {#if subtitleError.ignoreRule != ""}
        <span class="ignore-rule">
            Para ignorar, colocar <b>{subtitleError.ignoreRule}</b> en campo de efecto.
        </span>
    {/if}
</span>
