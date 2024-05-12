<script lang="ts">
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <img class="wallpaper" src="img/hyouka.jpg" alt="" />
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }

    .wallpaper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
</style>
