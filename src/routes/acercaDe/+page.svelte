<svelte:head>
    <title>About</title>
    <meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
    <h1>Acerca de Asu</h1>

    <div class="kagamin">
        <img src="img/kagamin.gif" alt="" />
    </div>

    <p class="mt-2">
        Asu versión web, de <a
            href="https://github.com/FS-Frost"
            target="_blank">[FS] Frost</a
        >
        para <a href="http://syncrajo.net/" target="_blank">SyncRajo Fansub</a>.
    </p>

    <p class="mt-2">Agradecimientos por su ayuda a:</p>

    <ul>
        <li>- [GX] Gonxas: hardcode testing y script para crear AVS.</li>

        <li>- [Sr] Hell: servicio de host.</li>

        <li>- [EC] DarkAngel: idea para separar sílabas en karaokes.</li>
    </ul>

    <p class="mt-2">
        Asu es una herramienta para automatizar el procesamiento de subtítulos
        en formato SubStation Alpha Subtitles (SSA/ASS).
    </p>

    <p class="mt-2">
        <b>
            Visítanos en
            <a href="http://syncrajo.net/" target="_blank"
                >http://syncrajo.net</a
            >
        </b>
    </p>

    <p class="mt-2">Versiones de Asu:</p>

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
        width: 50%;
    }
</style>
