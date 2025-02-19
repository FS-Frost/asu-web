<script lang="ts">
    import {
        BuildInfo,
        buildInfoStore,
        generateCommitLink,
        generateShortSha,
    } from "$lib/buildInfo";
    import text from "$lib/text";
    import { onMount } from "svelte";

    const title: string = text.acercaDe;

    let buildInfo = $state<BuildInfo>(BuildInfo.parse({}));

    onMount(async () => {
        buildInfoStore.subscribe((value) => {
            if (value == null) {
                return;
            }

            buildInfo = value;
        });
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="text-column">
    <h1>{title}</h1>

    {#if buildInfo.sha != ""}
        <span class="version">
            <a
                href={generateCommitLink(
                    buildInfo.actor,
                    buildInfo.repo,
                    buildInfo.sha,
                )}
                target="_blank"
            >
                Versión {buildInfo.ref}.{generateShortSha(buildInfo.sha)} desplegada
                por
                {buildInfo.actor}
            </a>
        </span>
    {/if}

    <div class="kagamin">
        <img src="img/kagamin.gif" alt="Lucky Star" title="Lucky Star" />
    </div>

    <p class="mt-2">
        Asu es una herramienta para automatizar el procesamiento de subtítulos
        en formato SubStation Alpha Subtitles (SSA/ASS).
    </p>

    <hr />

    <p>
        Asu versión web, de <a
            href="https://github.com/FS-Frost"
            target="_blank">[FS] Frost</a
        >
        para <a href="http://syncrajo.net/" target="_blank">SyncRajo Fansub</a>.
    </p>

    <p class="mt-2">Agradecimientos por su ayuda a:</p>

    <ul>
        <li>
            - <b>[EC] DarkAngel</b>: por desarrollar <b>SyncRajoEndline</b> y por
            la idea de separar sílabas en karaokes.
        </li>

        <li>
            - <b>[GX] Gonxas</b>: por el hardcore testing y el script para crear
            archivos AVS.
        </li>

        <li>- <b>[Sr] Hell</b>: por proveer un servicio de host.</li>
    </ul>

    <p class="mt-2">
        <b>
            Visítanos en
            <a href="http://syncrajo.net/" target="_blank"
                >http://syncrajo.net</a
            >
        </b>
    </p>

    <hr />

    <p>Versiones de Asu:</p>

    <ul>
        <li>
            <a
                href="https://github.com/FS-Frost/Asu.Utilidades"
                target="_blank"
            >
                - (2014) Asu para .NET/C#
            </a>
        </li>

        <li>
            <a href="https://github.com/FS-Frost/asu-go2js" target="_blank">
                - (2022) Asu para Go y JavaScript
            </a>
        </li>

        <li>
            <a href="https://github.com/FS-Frost/asu-regex-js" target="_blank">
                - (2024) Asu para TypeScript
            </a>
        </li>
    </ul>
</div>

<style>
    .kagamin {
        display: flex;
        justify-content: center;
    }

    .kagamin img {
        width: 100%;
    }

    hr {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .version {
        width: 100%;
        text-align: center;
        color: gray;
        font-style: italic;
        margin-bottom: 0.5rem;
    }
</style>
