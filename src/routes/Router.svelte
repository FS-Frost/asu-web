<script lang="ts">
    import { activePageStore, type ActivePage, isPage } from "$lib/activePage";
    import { onMount } from "svelte";
    import CopiarMovimiento from "$lib/gui/pages/carteles/CopiarMovimiento.svelte";
    import AcercaDe from "$lib/gui/pages/AcercaDe.svelte";
    import Inicio from "$lib/gui/pages/Inicio.svelte";
    import AplicarAlpha from "$lib/gui/pages/carteles/AplicarColor/AplicarAlpha.svelte";
    import AplicarColor from "$lib/gui/pages/carteles/AplicarColor/AplicarColor.svelte";
    import AplicarSecuenciaPosiciones from "$lib/gui/pages/carteles/AplicarSecuenciaPosiciones.svelte";
    import DividirSilabas from "$lib/gui/pages/karaokes/DividirSilabas.svelte";
    import DividirKaraoke from "$lib/gui/pages/karaokes/DividirKaraoke.svelte";
    import ValidarDialogos from "$lib/gui/pages/dialogos/ValidarDialogos.svelte";
    import AplicarTraslacion from "$lib/gui/pages/carteles/AplicarTraslacion.svelte";
    import VisualizarDialogos from "$lib/gui/pages/dialogos/VisualizarDialogos/VisualizarDialogos.svelte";
    import EmparejarSilabas from "$lib/gui/pages/karaokes/EmparejarSilabas.svelte";

    let page = $state<ActivePage | "">("");

    onMount(() => {
        activePageStore.subscribe((newActivePage) => {
            if (newActivePage == null) {
                return;
            }

            page = newActivePage;
        });

        const urlParams = new URLSearchParams(location.search);
        const rawUrlPage = urlParams.get("pagina") ?? "";
        const urlPage: ActivePage = isPage(rawUrlPage) ? rawUrlPage : "inicio";
        activePageStore.set(urlPage);
    });
</script>

{#if page == "inicio"}
    <Inicio />
{:else if page == "carteles.copiarMovimiento"}
    <CopiarMovimiento />
{:else if page == "carteles.aplicarSecuenciaPosiciones"}
    <AplicarSecuenciaPosiciones />
{:else if page == "carteles.aplicarAlpha"}
    <AplicarAlpha />
{:else if page == "carteles.aplicarColor"}
    <AplicarColor />
{:else if page == "carteles.aplicarTraslacion"}
    <AplicarTraslacion />
{:else if page == "dialogos.visualizarDialogos"}
    <VisualizarDialogos />
{:else if page == "dialogos.validarDialogos"}
    <ValidarDialogos />
{:else if page == "karaokes.dividirKaraoke"}
    <DividirKaraoke />
{:else if page == "karaokes.dividirSilabas"}
    <DividirSilabas />
{:else if page == "karaokes.emparejarSilabas"}
    <EmparejarSilabas />
{:else if page == "acercaDe"}
    <AcercaDe />
{/if}
