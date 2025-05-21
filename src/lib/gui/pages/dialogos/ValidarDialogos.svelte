<script lang="ts">
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";
    import {
        validateSubtitles,
        type SubtitleMode,
        type SubtitleError,
        detectSubtitlesMode,
    } from "$lib/validateSubtitles";
    import { loadOptions, Options } from "./validarDialogosOptions";
    import { onMount, tick } from "svelte";
    import FileError from "./FileError.svelte";
    import ModalOptions from "./ModalOptions.svelte";
    import Swal from "sweetalert2";
    import { descargarSubsEjemplo } from "$lib/subs";
    import { downloadBlob } from "$lib/utils";

    const title: string = text.validarDialogos;

    type FileResult = {
        subsType: string;
        fileName: string;
        errors: SubtitleError[];
        warnings: SubtitleError[];
        errorsVisible: boolean;
        warningsVisible: boolean;
    };

    let actualSubsMode = $state<SubtitleMode>("diálogos");
    let inputFiles = $state<HTMLInputElement>();
    let totalErrors = $state<number>(0);
    let totalWarnings = $state<number>(0);
    let results = $state<FileResult[]>([]);
    let loading = $state<boolean>(false);
    let options = $state<Options>(Options.parse({}));
    let modalOptions = $state<ModalOptions>();

    async function handleFiles(): Promise<void> {
        const geminiEnabled = options.geminiEnabled;

        try {
            if (options.geminiEnabled && options.geminiApiKey === "") {
                alert("Ingrese el API KEY de Google Gemini.");
                modalOptions?.open();
                return;
            }

            if (options.geminiEnabled) {
                const html = `
                    <img
                        src="img/sakura.gif"
                        alt="Cardcaptor Sakura"
                        title="Cardcaptor Sakura"
                        style="height: 16rem"
                    />
                `;

                const swalResult = await Swal.fire({
                    title: "Google Gemini habilitado. ¿Continuar?",
                    confirmButtonText: "Continuar",
                    cancelButtonText: "Continuar sin Google Gemini",
                    showCancelButton: true,
                    html: html,
                });

                if (!swalResult.isConfirmed) {
                    options.geminiEnabled = false;
                }
            }

            const files = [...(inputFiles?.files ?? [])];
            totalErrors = 0;
            totalWarnings = 0;
            results = [];
            loading = true;

            for (const file of files) {
                const content = await file.text();
                const assFile = asu.parseASSFile(content);
                if (assFile == null) {
                    console.error("archivo inválido", file.name);
                    continue;
                }

                actualSubsMode = detectSubtitlesMode(
                    file.name,
                    options.userSubsMode,
                );

                const validationResult = await validateSubtitles(
                    actualSubsMode,
                    assFile,
                    options,
                );

                totalErrors += validationResult.errors.length;
                totalWarnings += validationResult.warnings.length;

                results.push({
                    subsType: actualSubsMode,
                    fileName: file.name,
                    errors: validationResult.errors,
                    warnings: validationResult.warnings,
                    errorsVisible: false,
                    warningsVisible: false,
                });
            }
        } catch (error) {
            console.error("error al procesar archivos", error);
        } finally {
            options.geminiEnabled = geminiEnabled;
            if (inputFiles != null) {
                inputFiles.value = "";
            }

            loading = false;
            await scrollToResults();
        }
    }

    function generateResultColorClass(result: FileResult): string {
        if (result.errors.length > 0) {
            return "has-text-danger";
        }

        if (result.warnings.length > 0) {
            return "has-text-warning";
        }

        return "has-text-success";
    }

    async function scrollToResults(): Promise<void> {
        await tick();
        const element = document.querySelector(".result-info");
        if (element == null) {
            return;
        }

        element.scrollIntoView({
            behavior: "smooth",
        });
    }

    function downloadResults(): void {
        let text = `Archivos: ${results.length}`;

        for (const result of results) {
            text += `\n`;
            text += `\n======================================================================`;
            text += `\n${result.fileName}:`;
            text += `\nErrores: ${result.errors.length}`;
            text += `\nAdvertencias: ${result.warnings.length}`;

            for (const error of result.errors) {
                text += `\n`;
                text += `\nERROR: ${error.location}: ${error.error}`;
                text += `\nTEXTO: ${error.text}`;
            }

            for (const warning of result.warnings) {
                text += `\n`;
                text += `\nADVERTENCIA: ${warning.location}: ${warning.error}`;
                text += `\nTEXTO: ${warning.text}`;
            }
        }

        const blob = new Blob([text], {
            type: "plain/text",
        });

        downloadBlob(blob, "Resultados.txt");
    }

    onMount(() => {
        options = loadOptions();
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section>
    <h1>{title}</h1>

    <div class="options boxed mb-4">
        <button
            class="button is-link mb-2 btn-settings is-fullwidth"
            onclick={() => modalOptions?.open()}
        >
            Ver configuración
        </button>

        <div class="options-info">
            <span class="tag is-dark">
                Modo {options.userSubsMode}
            </span>

            {#if options.geminiEnabled}
                <span class="tag is-dark">
                    {text.validateWithGemini}: {options.geminiModel}
                </span>
            {/if}

            {#if options.validateLineStyleExists}
                <span class="tag is-dark">
                    {text.validateLineStyleExists}
                </span>
            {/if}

            {#if options.validateTextStart}
                <span class="tag is-dark"> {text.validateTextStart} </span>
            {/if}

            {#if options.validateTextEnd}
                <span class="tag is-dark"> {text.validateTextEnd} </span>
            {/if}

            {#if options.validateTextSpaces}
                <span class="tag is-dark"> {text.validateTextSpaces} </span>
            {/if}

            {#if options.validateTextPunctuation}
                <span class="tag is-dark">
                    {text.validateTextPunctuation}
                </span>
            {/if}
        </div>
    </div>

    <button
        class="button mb-2 btn-example is-fullwidth"
        onclick={descargarSubsEjemplo}
    >
        Descargar subtítulos de ejemplo
    </button>

    <div class="file is-fullwidth mb-2">
        <label class="file-label">
            <input
                class="file-input"
                type="file"
                bind:this={inputFiles}
                accept=".ass"
                onchange={handleFiles}
                multiple
                disabled={loading}
            />
            <span class="file-cta">
                <span class="file-icon">
                    <i class="fas fa-upload"></i>
                </span>
                <span class="file-label"> Cargar subtítulos </span>
            </span>
        </label>
    </div>

    {#if loading}
        <div class="result-info">
            <div class="counter">PROCESANDO</div>

            <div class="image-container">
                <img
                    class="result-image"
                    src="img/nagato.gif"
                    alt="Suzumiya Haruhi"
                    title="Suzumiya Haruhi"
                />
            </div>

            <div class="counter">SUBTÍTULOS</div>
        </div>
    {/if}

    {#if !loading && results.length > 0}
        <button
            class="button is-secondary is-fullwidth mb-2"
            onclick={downloadResults}
        >
            Descargar resultados
        </button>

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

        {#each results as result}
            <div class="result">
                <span
                    class="name {generateResultColorClass(
                        result,
                    )} text-{result.subsType}"
                >
                    {result.fileName}
                </span>

                {#if result.errors.length == 0 && result.warnings.length == 0}
                    <div class="has-text-success text-{result.subsType}">
                        ¡Todo en orden! Detectado como {result.subsType}.

                        {#if result.subsType === "carteles"}
                            Ignorado.
                        {/if}
                    </div>
                {:else}
                    <div class={generateResultColorClass(result)}>
                        Detectado como {result.subsType}.
                    </div>
                {/if}

                {#if result.errors.length > 0}
                    <div class="errors-list">
                        <button
                            class="button is-danger is-outlined"
                            onclick={() =>
                                (result.errorsVisible = !result.errorsVisible)}
                        >
                            {result.errorsVisible
                                ? "Ocultar errores"
                                : "Ver errores"}: {result.errors.length}
                        </button>

                        {#if result.errorsVisible}
                            <div class="file-errors">
                                {#each result.errors as error}
                                    <FileError
                                        kind="error"
                                        subtitleError={error}
                                    ></FileError>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/if}

                {#if result.warnings.length > 0}
                    <div class="warnings-list">
                        <button
                            class="button is-warning is-outlined"
                            onclick={() =>
                                (result.warningsVisible =
                                    !result.warningsVisible)}
                        >
                            {result.warningsVisible
                                ? "Ocultar advertencias"
                                : "Ver advertencias"}: {result.warnings.length}
                        </button>

                        {#if result.warningsVisible}
                            <div class="file-errors">
                                {#each result.warnings as warning}
                                    <FileError
                                        kind="warning"
                                        subtitleError={warning}
                                    ></FileError>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    {/if}
</section>

<ModalOptions bind:this={modalOptions} bind:options></ModalOptions>

<style>
    section {
        width: 100%;
    }

    .result-info {
        display: grid;
        grid-template-columns: auto auto auto;
    }

    @media only screen and (max-width: 600px) {
        .result-info {
            grid-template-columns: unset;
        }
    }

    .image-container {
        display: flex;
        justify-content: center;
        vertical-align: middle;
    }

    .counters {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 10rem;
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

    .file {
        margin: 0;
    }

    .file-cta {
        width: 100%;
    }

    .result-image {
        height: 16rem;
    }

    .result {
        margin-top: 0.5rem;
        padding: 0.6rem;
        border: 0.05rem #969696 solid;
        border-radius: 0.5rem;
    }

    .name {
        font-weight: bold;
    }

    .text-carteles {
        color: darkgray;
    }

    .file-errors {
        display: flex;
        flex-direction: column;
    }

    .ignore-rule {
        color: darkgray;
    }

    .errors-list,
    .warnings-list {
        margin-top: 0.5rem;
    }

    .errors-list,
    .warnings-list {
        button {
            width: 15rem;
        }
    }

    .options {
        display: flex;
        flex-direction: column;
    }

    .options-info {
        gap: 0.5rem;
        display: grid;
        grid-template-columns: auto auto auto;
    }

    .options-info span {
        text-wrap: auto;
        height: 3rem;
        text-align: center;
    }

    @media only screen and (max-width: 600px) {
        .options-info span {
            font-size: x-small;
        }
    }

    .btn-settings {
        height: fit-content;
    }

    .btn-example {
        justify-content: left;
    }
</style>
