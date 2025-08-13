<script lang="ts">
    type Props = {
        promt: string;
    };

    let { promt }: Props = $props();

    let visible = $state<boolean>(false);

    async function copyToClipboard(): Promise<void> {
        await navigator.clipboard.writeText(promt);
        alert("¡Promt copiado al portapapeles!");
    }
</script>

<div class="promt">
    <div class="options">
        <button
            class="button is-small mt-2 mb-2"
            onclick={() => (visible = !visible)}
        >
            {visible ? "Ocultar" : "Ver"} promt
        </button>

        <button class="button is-small mt-2 mb-2" onclick={copyToClipboard}>
            Copiar promt
        </button>
    </div>

    {#if visible}
        <textarea class="textarea" value={promt}></textarea>
    {/if}
</div>

<style>
    .promt {
        width: 100%;
    }

    .promt textarea {
        width: 100%;
        height: 30rem;
    }
</style>
