<script lang="ts">
    import text from "$lib/text";
    export let rawResultLines: string;

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
    on:click={() => copyResult()}
    on:keydown={() => {}}
></i>
