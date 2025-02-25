<script lang="ts">
    import * as asu from "@fs-frost/asu";
    import { onMount, tick } from "svelte";

    type Kind = "error" | "warning" | "readonly";

    type Props = {
        kind: Kind;
        text: string;
        rawMode: boolean;
        hiddeOptions?: boolean;
    };

    let { kind, text, rawMode, hiddeOptions = false }: Props = $props();

    let visibleText = $state<string>(text);
    let rows = $state<number>(1);
    let textArea = $state<HTMLElement>();

    async function alternateText(): Promise<void> {
        rawMode = !rawMode;
        await update();
    }

    async function update(): Promise<void> {
        updateVisibleText();
        await tick();
        updateRows();
    }

    function updateVisibleText(): void {
        if (rawMode) {
            visibleText = text;
            return;
        }

        const items = asu.parseContent(text).filter((x) => x.name === "text");
        let newText = asu.contentsToString(items);
        newText = newText.replaceAll("\\N", "");
        visibleText = newText;
    }

    function updateRows(): void {
        rows = calculateRows();
    }

    function calculateRows(): number {
        if (textArea == null) {
            return 1;
        }

        return Math.ceil(textArea.scrollHeight / textArea.clientHeight);
    }

    function generateTextAreaClass(kind: Kind): string {
        switch (kind) {
            case "error":
                return "is-danger";
            case "warning":
                return "is-warning";
            default:
                return "";
        }
    }

    onMount(async () => {
        await update();
    });
</script>

<div class="area {hiddeOptions ? 'without-options' : 'with-options'}">
    <textarea
        bind:this={textArea}
        class="textarea {generateTextAreaClass(kind)}"
        value={visibleText}
        readonly
        {rows}
    ></textarea>

    {#if !hiddeOptions}
        <button class="button" onclick={alternateText} aria-label="alternar">
            {rawMode ? "Ocultar etiquetas" : "Ver etiquetas"}
        </button>
    {/if}
</div>

<style>
    .area.with-options {
        display: grid;
        grid-template-columns: 85% auto;
        gap: 0.5rem;
    }

    .area.without-options {
        display: grid;
        grid-template-columns: auto;
        gap: 0.5rem;
    }

    textarea {
        width: 100%;
    }
</style>
