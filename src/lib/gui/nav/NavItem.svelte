<script lang="ts">
    import { activePage, type ActivePage } from "$lib/activePage";

    export let text: string;
    export let page: ActivePage;

    function generateLink(page: ActivePage): string {
        return `?page=${page}`;
    }
</script>

<a
    class="navbar-item"
    href={generateLink(page)}
    on:click={() => activePage.set(page)}
>
    {text}
</a>
