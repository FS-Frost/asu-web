<script lang="ts">
    import NavItem from "./NavItem.svelte";
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
        </div>

        <div class="navbar-end">
            <NavItem text="Acerca de" page="acercaDe" />
        </div>
    </div>
</nav>

<style>
    .navbar-menu {
        display: contents;
    }
</style>
