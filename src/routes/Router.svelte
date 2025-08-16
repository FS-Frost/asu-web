<script lang="ts">
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
    import { appState } from "$lib/state.svelte";
    import { Page } from "$lib/page";

    onMount(() => {
        const urlParams = new URLSearchParams(location.search);
        const rawUrlPage = urlParams.get("pagina") ?? "";
        const parseResult = Page.safeParse(rawUrlPage);
        if (parseResult.success) {
            appState.activePage = parseResult.data;
        }
    });
</script>

{#if appState.activePage == "inicio"}
    <Inicio />
{:else if appState.activePage == "carteles.copiarMovimiento"}
    <CopiarMovimiento />
{:else if appState.activePage == "carteles.aplicarSecuenciaPosiciones"}
    <AplicarSecuenciaPosiciones />
{:else if appState.activePage == "carteles.aplicarAlpha"}
    <AplicarAlpha />
{:else if appState.activePage == "carteles.aplicarColor"}
    <AplicarColor />
{:else if appState.activePage == "carteles.aplicarTraslacion"}
    <AplicarTraslacion />
{:else if appState.activePage == "dialogos.visualizarDialogos"}
    <VisualizarDialogos />
{:else if appState.activePage == "dialogos.validarDialogos"}
    <ValidarDialogos />
{:else if appState.activePage == "karaokes.dividirKaraoke"}
    <DividirKaraoke />
{:else if appState.activePage == "karaokes.dividirSilabas"}
    <DividirSilabas />
{:else if appState.activePage == "karaokes.emparejarSilabas"}
    <EmparejarSilabas />
{:else if appState.activePage == "acercaDe"}
    <AcercaDe />
{/if}
