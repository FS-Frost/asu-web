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
    <p class="m-1">
        <b>{subtitleError.location}</b>:
        {subtitleError.error + (subtitleError.error.endsWith(".") ? "" : ".")}
    </p>

    {#if subtitleError.text != ""}
        <SubsArea {kind} text={subtitleError.text} rawMode={false}></SubsArea>
    {/if}

    {#if subtitleError.ignoreRule != ""}
        <p class="ignore-rule m-1">
            Para ignorar, colocar <b>{subtitleError.ignoreRule}</b> en campo de efecto.
        </p>
    {/if}
</span>
