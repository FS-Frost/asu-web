<script lang="ts">
    import { activePage } from "$lib/store";
</script>

<nav class="navbar" aria-label="main navigation">
    <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
            <a
                class="navbar-item"
                href="#_"
                on:click={() => activePage.set("inicio")}
            >
                Inicio
            </a>

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link" href="#_"> Carteles </a>

                <div class="navbar-dropdown">
                    <a
                        class="navbar-item"
                        href="#_"
                        on:click={() =>
                            activePage.set("carteles.copiarMovimiento")}
                    >
                        Copiar movimiento
                    </a>
                </div>
            </div>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <a
                        class="button is-light"
                        href="#_"
                        on:click={() => activePage.set("acercaDe")}
                    >
                        Acerca de
                    </a>
                </div>
            </div>
        </div>
    </div>
</nav>
