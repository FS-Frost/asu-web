<script lang="ts">
    import NavItem from "./NavItem.svelte";
    import { generateBranchLink } from "$lib/buildInfo";
    import text from "$lib/text";
    import { appState } from "$lib/state.svelte";

    let isMenuOpen = $state(false);

    function closeMenu(): void {
        isMenuOpen = false;
    }

    function toggleMenu(): void {
        isMenuOpen = !isMenuOpen;
    }

    $effect(() => {
        appState.activePage && closeMenu();
    });
</script>

<nav class="navbar">
    <button
        onclick={() => toggleMenu()}
        class="navbar-burger {isMenuOpen ? 'is-active' : ''}"
        data-target="navMenu"
        aria-label="menu"
        aria-expanded={isMenuOpen}
        type="button"
        style="background: none; border: none; cursor: pointer;"
    >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
    </button>

    <div class="navbar-menu {isMenuOpen ? 'is-active' : ''}" id="navMenu">
        <div class="navbar-start">
            <NavItem text="Inicio" page="inicio" />

            <div class="navbar-item has-dropdown is-hoverable">
                <div class="navbar-link">Carteles</div>

                <div class="navbar-dropdown">
                    <NavItem text={text.aplicarAlpha} page="carteles.aplicarAlpha" />

                    <NavItem text={text.aplicarColor} page="carteles.aplicarColor" />

                    <NavItem text={text.aplicarSecuenciaPosiciones} page="carteles.aplicarSecuenciaPosiciones" />

                    <NavItem text={text.aplicarTraslacion} page="carteles.aplicarTraslacion" />

                    <NavItem text={text.copiarMovimiento} page="carteles.copiarMovimiento" />
                </div>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
                <div class="navbar-link">Diálogos</div>

                <div class="navbar-dropdown">
                    <NavItem text={text.visualizarDialogos} page="dialogos.visualizarDialogos" />

                    <NavItem text={text.validarDialogos} page="dialogos.validarDialogos" />
                </div>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
                <div class="navbar-link">Karaokes</div>

                <div class="navbar-dropdown">
                    <NavItem text={text.dividirKaraoke} page="karaokes.dividirKaraoke" />

                    <NavItem text={text.dividirSilabas} page="karaokes.dividirSilabas" />

                    <NavItem text={text.emparejarSilabas} page="karaokes.emparejarSilabas" />
                </div>
            </div>

            <NavItem text={text.acercaDe} page="acercaDe" />
        </div>

        {#if appState.buildInfo.sha != ""}
            <div class="navbar-end">
                <a class="navbar-item" title={text.verGitHub} href={generateBranchLink(appState.buildInfo.actor, appState.buildInfo.repo, appState.buildInfo.ref)} target="_blank">
                    {text.verGitHub}
                </a>
            </div>
        {/if}
    </div>
</nav>
