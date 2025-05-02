<script>
    import NavBar from "$lib/gui/nav/NavBar.svelte";
    import { onMount } from "svelte";
    import "./styles.css";
    import * as asu from "@fs-frost/asu";
    import { buildInfoStore, getBuildInfo } from "$lib/buildInfo";

    onMount(async () => {
        window.asu = asu;
        console.log("window.asu", window.asu);

        buildInfoStore.set(await getBuildInfo());
    });
</script>

<div class="app">
    <NavBar />

    <main>
        <slot />
    </main>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-bottom: 1rem;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }
</style>
