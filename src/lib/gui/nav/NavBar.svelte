<script lang="ts">
    import NavItem from "./NavItem.svelte";
    import { BuildInfo, generateBranchLink } from "$lib/buildInfo";
    import text from "$lib/text";
    import { appState } from "$lib/state.svelte";

    let buildInfo = $state<BuildInfo>(BuildInfo.parse({}));
    let navMenu = $state<HTMLElement>();
    let navToggle = $state<HTMLElement>();

    function closeMenu(): void {
        if (navToggle) {
            navToggle.classList.remove("is-active");
        }

        if (navMenu) {
            navMenu.classList.remove("is-active");
        }
    }

    function toggleMenu(): void {
        if (navToggle) {
            navToggle.classList.toggle("is-active");
        }

        if (navMenu) {
            navMenu.classList.toggle("is-active");
        }
    }

    $effect(() => {
        appState.activePage && closeMenu();
    });
</script>

<nav class="navbar">
    <a
        bind:this={navToggle}
        onclick={() => toggleMenu()}
        role="button"
        tabindex="0"
        class="navbar-burger"
        data-target="navMenu"
        aria-label="menu"
        aria-expanded="false"
        onkeydown={() => {}}
        href={`javascript:;`}
    >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
    </a>

    <div bind:this={navMenu} class="navbar-menu" id="navMenu">
        <div class="navbar-start">
            <NavItem text="Inicio" page="inicio" />

            <div class="navbar-item has-dropdown is-hoverable">
                <div class="navbar-link">Carteles</div>

                <div class="navbar-dropdown">
                    <NavItem
                        text={text.aplicarAlpha}
                        page="carteles.aplicarAlpha"
                    />

                    <NavItem
                        text={text.aplicarColor}
                        page="carteles.aplicarColor"
                    />

                    <NavItem
                        text={text.aplicarSecuenciaPosiciones}
                        page="carteles.aplicarSecuenciaPosiciones"
                    />

                    <NavItem
                        text={text.aplicarTraslacion}
                        page="carteles.aplicarTraslacion"
                    />

                    <NavItem
                        text={text.copiarMovimiento}
                        page="carteles.copiarMovimiento"
                    />
                </div>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
                <div class="navbar-link">Diálogos</div>

                <div class="navbar-dropdown">
                    <NavItem
                        text={text.visualizarDialogos}
                        page="dialogos.visualizarDialogos"
                    />

                    <NavItem
                        text={text.validarDialogos}
                        page="dialogos.validarDialogos"
                    />
                </div>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
                <div class="navbar-link">Karaokes</div>

                <div class="navbar-dropdown">
                    <NavItem
                        text={text.dividirKaraoke}
                        page="karaokes.dividirKaraoke"
                    />

                    <NavItem
                        text={text.dividirSilabas}
                        page="karaokes.dividirSilabas"
                    />

                    <NavItem
                        text={text.emparejarSilabas}
                        page="karaokes.emparejarSilabas"
                    />
                </div>
            </div>

            <NavItem text={text.acercaDe} page="acercaDe" />
        </div>

        {#if buildInfo.sha != ""}
            <div class="navbar-end">
                <a
                    class="navbar-item"
                    title={text.verGitHub}
                    href={generateBranchLink(
                        buildInfo.actor,
                        buildInfo.repo,
                        buildInfo.ref,
                    )}
                    target="_blank"
                >
                    {text.verGitHub}
                </a>
            </div>
        {/if}
    </div>
</nav>
