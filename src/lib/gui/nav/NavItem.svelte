<script lang="ts">
    import { activePage, type ActivePage } from "$lib/activePage";
    import { onMount } from "svelte";

    type Props = {
        text: string;
        page: ActivePage;
    };

    let { text, page }: Props = $props();

    let isActive = $state<boolean>(false);

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
    onclick={() => activePage.set(page)}
>
    {text}
</a>
