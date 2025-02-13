<script lang="ts">
    import * as asu from "@fs-frost/asu";
    import { onMount, tick } from "svelte";

    type Props = {
        text: string;
        rawMode: boolean;
    };

    let { text, rawMode }: Props = $props();

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

    onMount(async () => {
        await update();
    });
</script>

<div class="area">
    <textarea
        bind:this={textArea}
        class="textarea is-danger"
        value={visibleText}
        readonly
        {rows}
    ></textarea>

    <button class="button" onclick={alternateText} aria-label="alternar">
        {rawMode ? "Ocultar etiquetas" : "Ver etiquetas"}
    </button>
</div>

<style>
    .area {
        display: grid;
        grid-template-columns: 85% auto;
        gap: 0.5rem;
    }

    textarea {
        width: 100%;
    }
</style>
