<script lang="ts">
    import { onMount } from "svelte";
    import NavItem from "./NavItem.svelte";
    import { BuildInfo, getBuildInfo } from "$lib/buildInfo";

    let buildInfo: BuildInfo = BuildInfo.parse({});

    onMount(async () => {
        buildInfo = await getBuildInfo();
    });
</script>

<nav class="navbar">
    <div class="navbar-menu">
        <div class="navbar-start">
            <NavItem text="Inicio" page="inicio" />

            <div class="navbar-item has-dropdown is-hoverable">
                <div class="navbar-link">Carteles</div>

                <div class="navbar-dropdown">
                    <NavItem
                        text="Aplicar alpha"
                        page="carteles.aplicarAlpha"
                    />

                    <NavItem
                        text="Copiar movimiento"
                        page="carteles.copiarMovimiento"
                    />
                </div>
            </div>

            <NavItem text="Acerca de" page="acercaDe" />
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

<style>
    .navbar-menu {
        display: contents;
    }
</style>
