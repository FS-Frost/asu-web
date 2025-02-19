<script lang="ts">
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";
    import {
        SUBTITLE_MODES,
        validateSubtitles,
        type SubtitleMode,
        type SubtitleError,
        detectSubtitlesMode,
    } from "$lib/validateSubtitles";
    import {
        loadOptions,
        Options,
        saveOptions,
    } from "./validarDialogosOptions";
    import { onMount } from "svelte";
    import FileError from "./FileError.svelte";

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
    let optionsVisible = $state<boolean>(false);
    let options = $state<Options>(Options.parse({}));

    async function handleFiles(): Promise<void> {
        try {
            if (options.geminiEnabled && options.geminiApiKey === "") {
                alert("Ingrese el API KEY de Google Gemini.");
                optionsVisible = true;
                return;
            }

            saveOptions(options);
            const files = [...(inputFiles?.files ?? [])];
            totalErrors = 0;
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
                    {
                        geminiEnabled: options.geminiEnabled,
                        geminiApiKey: options.geminiApiKey,
                    },
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
            if (inputFiles != null) {
                inputFiles.value = "";
            }

            loading = false;
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

    function toggleOptions(): void {
        optionsVisible = !optionsVisible;
        saveOptions(options);
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

    <button class="button is-link is-fullwidth mb-2" onclick={toggleOptions}>
        {optionsVisible ? "Ocultar opciones" : "Ver opciones"}
    </button>

    {#if optionsVisible}
        <div class="select is-fullwidth mb-2">
            <select bind:value={options.userSubsMode}>
                {#each SUBTITLE_MODES as mode}
                    <option value={mode}>Modo {mode}</option>
                {/each}
            </select>
        </div>

        <div class="field">
            <label class="checkbox">
                <input type="checkbox" bind:checked={options.geminiEnabled} />
                Habilitar validación con Google Gemini (lento)
            </label>

            {#if options.geminiEnabled}
                <div class="field">
                    <label class="label" for="">API KEY</label>
                    <div class="control">
                        <input
                            class="input"
                            type="password"
                            bind:value={options.geminiApiKey}
                            placeholder="Ingresa tu API KEY"
                            disabled={loading}
                        />
                    </div>
                </div>

                <p>
                    <a
                        href="https://aistudio.google.com/apikey"
                        target="_blank"
                    >
                        Clic aquí para obtener una API KEY.
                    </a>
                </p>

                <p>
                    Las validaciones de Google Gemini serán siempre advertencias
                    debido a su tendencia a tener falsos positivos.
                </p>
            {/if}
        </div>
    {/if}

    <div class="field mt-2">
        <input
            bind:this={inputFiles}
            type="file"
            accept=".ass"
            onchange={handleFiles}
            multiple
            disabled={loading}
        />
    </div>

    {#if loading}
        <div>Procesando...</div>

        <img
            class="result-image"
            src="img/mai-sakurajima.gif"
            alt="Seishun Buta Yarou wa Bunny Girl Senpai no Yume wo Minai"
            title="Seishun Buta Yarou wa Bunny Girl Senpai no Yume wo Minai"
        />
    {/if}

    {#if results.length > 0}
        <div class="counters mb-2">
            <div
                class="counter {totalErrors == 0
                    ? 'has-text-success'
                    : 'has-text-danger'} mt-2"
            >
                <b>
                    Errores: {totalErrors}
                </b>
            </div>

            <div
                class="counter {totalWarnings == 0
                    ? 'has-text-success'
                    : 'has-text-warning'}"
            >
                <b>
                    Advertencias: {totalWarnings}
                </b>
            </div>
        </div>

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
    {/if}

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
                        class="button has-text-danger"
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
                                <FileError kind="error" subtitleError={error}
                                ></FileError>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}

            {#if result.warnings.length > 0}
                <div class="warnings-list">
                    <button
                        class="button has-text-warning"
                        onclick={() =>
                            (result.warningsVisible = !result.warningsVisible)}
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
</section>

<style>
    section {
        width: 100%;
    }

    .counter {
        width: 100%;
    }

    .result-image {
        height: 15rem;
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
</style>
