<script lang="ts">
    import { activePage, type ActivePage } from "$lib/store";
    import { onMount } from "svelte";
    import CopiarMovimiento from "$lib/pages/carteles/CopiarMovimiento.svelte";
    import AcercaDe from "$lib/pages/AcercaDe.svelte";
    import Inicio from "$lib/pages/Inicio.svelte";

    let page: ActivePage = "inicio";

    onMount(() => {
        activePage.subscribe((newActivePage) => {
            page = newActivePage;
        });
    });
</script>

{#if page == "inicio"}
    <Inicio />
{:else if page == "carteles.copiarMovimiento"}
    <CopiarMovimiento />
{:else if page == "acercaDe"}
    <AcercaDe />
{/if}
