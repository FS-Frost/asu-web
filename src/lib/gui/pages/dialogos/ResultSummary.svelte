<script lang="ts">
    type Props = {
        totalErrors: number;
        totalWarnings: number;
    };

    let { totalErrors, totalWarnings }: Props = $props();
</script>

<div class="result-info">
    <div
        class="counter {totalErrors == 0
            ? 'has-text-success'
            : 'has-text-danger'}"
    >
        ERRORES: {totalErrors}
    </div>

    <div class="image-container">
        {#if totalErrors === 0 && totalWarnings === 0}
            <img
                class="result-image"
                src="img/lucky-star-yay.gif"
                alt="Lucky Star"
                title="Lucky Star"
            />
        {:else if totalErrors > 10}
            <img
                class="result-image"
                src="img/nichijou.webp"
                alt="Nichijou"
                title="Nichijou"
            />
        {:else if totalErrors > 0}
            <img
                class="result-image"
                src="img/under-arrest.gif"
                alt="You're Under Arrest"
                title="You're Under Arrest"
            />
        {:else if totalWarnings > 0}
            <img
                class="result-image"
                src="img/new-game.gif"
                alt="New Game!"
                title="New Game!"
            />
        {/if}
    </div>

    <div
        class="counter {totalWarnings == 0
            ? 'has-text-success'
            : 'has-text-warning'}"
    >
        ADVERTENCIAS: {totalWarnings}
    </div>
</div>

<style>
    .result-info {
        display: grid;
        grid-template-columns: auto auto auto;
    }

    @media only screen and (max-width: 600px) {
        .result-info {
            grid-template-columns: unset;
        }
    }

    .counter {
        font-size: xx-large;
        font-weight: bold;
        width: auto;
        display: flex;
        vertical-align: middle;
        height: 100%;
        justify-content: center;
        flex-direction: column;
        text-align: center;
    }

    .image-container {
        display: flex;
        justify-content: center;
    }

    .result-image {
        height: 16rem;
    }
</style>
