<script lang="ts">
    import { onMount } from "svelte";
    import NavItem from "./NavItem.svelte";
    import { BuildInfo, getBuildInfo } from "$lib/buildInfo";
    import text from "$lib/text";

    let buildInfo: BuildInfo = BuildInfo.parse({});
    let navMenu: HTMLElement;
    let navToggle: HTMLElement;

    function toggleMenu(): void {
        if (navToggle) {
            navToggle.classList.toggle("is-active");
        }

        if (navMenu) {
            navMenu.classList.toggle("is-active");
        }
    }

    onMount(async () => {
        buildInfo = await getBuildInfo();
    });
</script>

<nav class="navbar">
    <a
        bind:this={navToggle}
        on:click={() => toggleMenu()}
        role="button"
        tabindex="0"
        class="navbar-burger"
        data-target="navMenu"
        aria-label="menu"
        aria-expanded="false"
        on:keydown={() => {}}
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
                        text={text.copiarMovimiento}
                        page="carteles.copiarMovimiento"
                    />
                </div>
            </div>

            <NavItem text={text.acercaDe} page="acercaDe" />
        </div>

        <div class="navbar-end">
            <a
                class="navbar-item"
                title="Ver en GitHub"
                href={`https://github.com/FS-Frost/asu-web/commit/${buildInfo.sha}`}
                target="_blank"
            >
                Versión {`${buildInfo.ref}.${buildInfo.sha.substring(0, 7)}`}
            </a>
        </div>
    </div>
</nav>
