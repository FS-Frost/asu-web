<script lang="ts">
    import text from "$lib/text";
    import { loadOptions, Options } from "./validarDialogosOptions";
    import { onMount, tick } from "svelte";
    import ModalOptions from "./ModalOptions.svelte";
    import Swal from "sweetalert2";
    import { descargarSubsEjemplo } from "$lib/subs";
    import { downloadBlob } from "$lib/utils";
    import Uploader from "./Uploader.svelte";
    import ProcessingOverlay from "./ProcessingOverlay.svelte";
    import ResultSummary from "./ResultSummary.svelte";
    import FileResultItem from "./FileResultItem.svelte";
    import { processFiles, type FileResult } from "$lib/subtitleValidationService";

    const title: string = text.validarDialogos;

    let totalErrors = $state<number>(0);
    let totalWarnings = $state<number>(0);
    let results = $state<FileResult[]>([]);
    let loading = $state<boolean>(false);
    let options = $state<Options>(Options.parse({}));
    let modalOptions = $state<ModalOptions>();
    let scrollingText = $state<string>("");

    async function handleFiles(files: File[]): Promise<void> {
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
                    confirmButtonText: "Con Gemini",
                    denyButtonText: "Sin Gemini",
                    cancelButtonText: "Cancelar",
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonColor: "#7066e0",
                    denyButtonColor: "#d33",
                    cancelButtonColor: "#6e7881",
                    width: "35rem",
                    html: html,
                });

                if (swalResult.isDenied) {
                    options.geminiEnabled = false;
                } else if (!swalResult.isConfirmed) {
                    return;
                }
            }

            loading = true;
            results = [];
            totalErrors = 0;
            totalWarnings = 0;
            scrollingText = "";

            const batchResult = await processFiles(files, options);

            totalErrors = batchResult.totalErrors;
            totalWarnings = batchResult.totalWarnings;
            results = batchResult.results;
            scrollingText = batchResult.scrollingText;

        } catch (error) {
            console.error("error al procesar archivos", error);
        } finally {
            options.geminiEnabled = geminiEnabled;
            loading = false;
            await scrollToResults();
        }
    }

    async function scrollToResults(): Promise<void> {
        await tick();
        const element = document.querySelector(".result-summary-anchor");
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

<section aria-label="Validador de Diálogos">
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
                    {text.validateWithGemini}:
                    {options.geminiModel.displayName}
                    ({options.geminiModel.version})
                </span>
            {/if}

            {#each [
                { cond: options.validateLineStyleExists, text: text.validateLineStyleExists },
                { cond: options.validateTextStart, text: text.validateTextStart },
                { cond: options.validateTextEnd, text: text.validateTextEnd },
                { cond: options.validateTextSpaces, text: text.validateTextSpaces },
                { cond: options.validateTextPunctuation, text: text.validateTextPunctuation },
                { cond: options.geminiInteractionsAPIEnabled, text: text.geminiInteractionsAPIEnabled }
            ] as item}
                {#if item.cond}
                    <span class="tag is-dark">{item.text}</span>
                {/if}
            {/each}
        </div>
    </div>

    <button
        class="button mb-2 btn-example is-fullwidth"
        onclick={descargarSubsEjemplo}
    >
        Descargar subtítulos de ejemplo
    </button>

    <Uploader onFilesSelected={handleFiles} {loading} />

    {#if loading}
        <div class="result-summary-anchor"></div>
        <ProcessingOverlay {scrollingText} />
    {/if}

    {#if !loading && results.length > 0}
        <div class="result-summary-anchor"></div>
        <button
            class="button is-secondary is-fullwidth mb-2"
            onclick={downloadResults}
        >
            Descargar resultados
        </button>

        <ResultSummary {totalErrors} {totalWarnings} />

        {#each results as _, i}
            <FileResultItem bind:result={results[i]} />
        {/each}
    {/if}
</section>

<ModalOptions bind:this={modalOptions} bind:options></ModalOptions>

<style>
    section {
        width: 100%;
        position: relative;
        min-height: 20rem;
    }

    .options {
        display: flex;
        flex-direction: column;
    }

    .options-info {
        gap: 0.5rem;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    }

    .options-info span {
        text-wrap: wrap;
        height: auto;
        min-height: 2.5rem;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
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
