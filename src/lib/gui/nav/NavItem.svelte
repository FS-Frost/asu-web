<script lang="ts">
    import { activePageStore, type ActivePage } from "$lib/activePage";
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
        activePageStore.subscribe((newActivePage) => {
            isActive = page === newActivePage;
        });
    });
</script>

<a
    class="navbar-item {isActive ? 'is-active' : ''}"
    href={generateLink(page)}
    onclick={() => activePageStore.set(page)}
    title={text}
>
    {text}
</a>
