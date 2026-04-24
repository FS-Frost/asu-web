<script lang="ts">
    type Props = {
        scrollingText: string;
    };

    let { scrollingText }: Props = $props();
</script>

<div class="result-info">
    <div class="counter">PROCESANDO</div>

    <div class="marquee-container">
        <p class="marquee">
            <span>{scrollingText}</span>
        </p>
        <p class="marquee marquee2">
            <span>{scrollingText}</span>
        </p>

        <div class="image-container">
            <img
                class="result-image"
                src="img/nagato.gif"
                alt="Suzumiya Haruhi"
                title="Suzumiya Haruhi"
            />
        </div>
    </div>

    <div class="counter">SUBTÍTULOS</div>
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

    .marquee-container {
        display: flex;
        position: relative;
        text-align: center;
        height: 16rem;
        overflow: hidden;
        width: 100%;
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
        width: 100%;
    }

    .result-image {
        height: 16rem;
    }

    .marquee {
        color: white;
        margin: 0 auto;
        white-space: nowrap;
        overflow: hidden;
        position: absolute;
    }

    .marquee span {
        display: inline-block;
        padding-left: 100%;
        animation: marquee 5s linear infinite;
    }

    .marquee2 span {
        animation-delay: 2.5s;
    }

    @keyframes marquee {
        0% { transform: translate(0, 0); }
        100% { transform: translate(-100%, 0); }
    }
</style>
