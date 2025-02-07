<script lang="ts">
    import text from "$lib/text";

    type Props = {
        rawResultLines: string;
    };

    let { rawResultLines }: Props = $props();

    async function copyResult(): Promise<void> {
        await navigator.clipboard.writeText(rawResultLines);
        alert(text.lineasCopiadas);
    }
</script>

<i
    class="fa-solid fa-copy clickable"
    role="button"
    tabindex="0"
    title={text.copiar}
    onclick={() => copyResult()}
    onkeydown={() => {}}
></i>
