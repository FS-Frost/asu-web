<script lang="ts">
    import { activePage, type ActivePage, isPage } from "$lib/store";
    import { onMount } from "svelte";
    import CopiarMovimiento from "$lib/pages/carteles/CopiarMovimiento.svelte";
    import AcercaDe from "$lib/pages/AcercaDe.svelte";
    import Inicio from "$lib/pages/Inicio.svelte";
    import AplicarAlpha from "$lib/pages/carteles/AplicarColor/AplicarAlpha.svelte";

    let page: ActivePage;

    onMount(() => {
        const urlParams = new URLSearchParams(location.search);
        const rawUrlPage = urlParams.get("page") ?? "";
        const urlPage: ActivePage = isPage(rawUrlPage) ? rawUrlPage : "inicio";
        page = urlPage;

        activePage.subscribe((newActivePage) => {
            if (newActivePage == null) {
                return;
            }

            page = newActivePage;
        });
    });
</script>

{#if page == "inicio"}
    <Inicio />
{:else if page == "carteles.copiarMovimiento"}
    <CopiarMovimiento />
{:else if page == "carteles.aplicarAlpha"}
    <AplicarAlpha />
{:else if page == "acercaDe"}
    <AcercaDe />
{/if}
