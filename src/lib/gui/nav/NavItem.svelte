<script lang="ts">
    import { activePage, type ActivePage } from "$lib/activePage";
    import { onMount } from "svelte";

    export let text: string;
    export let page: ActivePage;
    let isActive: boolean = false;

    function generateLink(page: ActivePage): string {
        return `?pagina=${page}`;
    }

    onMount(() => {
        activePage.subscribe((newActivePage) => {
            isActive = page === newActivePage;
        });
    });
</script>

<a
    class="navbar-item {isActive ? 'is-active' : ''}"
    href={generateLink(page)}
    on:click={() => activePage.set(page)}
>
    {text}
</a>
