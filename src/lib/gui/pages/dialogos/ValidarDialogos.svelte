<script lang="ts">
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";
    import SubsArea from "./SubsArea.svelte";
    import {
        SUBTITLE_MODES,
        validateSubtitles,
        type SubtitleMode,
        type SubtitleError,
        detectSubtitlesMode,
    } from "$lib/validateSubtitles";

    const title: string = text.validarDialogos;

    type FileResult = {
        subsType: string;
        fileName: string;
        errors: SubtitleError[];
    };

    let userSubsMode = $state<SubtitleMode>("automático");
    let actualSubsMode = $state<SubtitleMode>("diálogos");
    let inputFiles = $state<HTMLInputElement>();
    let totalErrors = $state<number>(0);
    let results = $state<FileResult[]>([]);

    async function handleFiles(): Promise<void> {
        const files = [...(inputFiles?.files ?? [])];
        totalErrors = 0;
        results = [];

        for (const file of files) {
            const content = await file.text();
            const assFile = asu.parseASSFile(content);
            if (assFile == null) {
                console.error("archivo inválido", file.name);
                continue;
            }

            actualSubsMode = detectSubtitlesMode(file.name, userSubsMode);

            const fileErrors = validateSubtitles(actualSubsMode, assFile);
            totalErrors += fileErrors.length;
            results.push({
                subsType: actualSubsMode,
                fileName: file.name,
                errors: fileErrors,
            });
        }

        if (inputFiles != null) {
            inputFiles.value = "";
        }
    }
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section>
    <h1>{title}</h1>

    <div class="select is-fullwidth mb-2">
        <select bind:value={userSubsMode}>
            {#each SUBTITLE_MODES as mode}
                <option value={mode}>Modo {mode}</option>
            {/each}
        </select>
    </div>

    <input
        bind:this={inputFiles}
        type="file"
        accept=".ass"
        onchange={handleFiles}
        multiple
    />

    {#if results.length > 0}
        <div
            class="error-counter text-{totalErrors == 0
                ? 'success'
                : 'failed'} mt-2"
        >
            <b>
                Errores detectados: {totalErrors}
            </b>
        </div>

        {#if totalErrors === 0}
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
        {:else}
            <img
                class="result-image"
                src="img/under-arrest.gif"
                alt="You're Under Arrest"
                title="You're Under Arrest"
            />
        {/if}
    {/if}

    {#each results as result}
        <div class="result">
            <span
                class="name text-{result.errors.length == 0
                    ? 'success'
                    : 'failed'} text-{result.subsType}"
            >
                {result.fileName}
            </span>

            {#if result.errors.length == 0}
                <div class="text-success text-{result.subsType}">
                    ¡Todo en orden! Detectado como {result.subsType}.

                    {#if result.subsType === "carteles"}
                        Ignorado.
                    {/if}
                </div>
            {:else}
                <div class="text-failed">
                    Detectado como {result.subsType}.
                </div>
            {/if}

            <div class="file-errors">
                {#each result.errors as error}
                    <span class="file-error">
                        {error.location}: {error.error}.

                        {#if error.text != ""}
                            <SubsArea text={error.text} rawMode={false}
                            ></SubsArea>
                        {/if}

                        {#if error.ignoreRule != ""}
                            <span class="ignore-rule">
                                Para ignorar, colocar <b>{error.ignoreRule}</b> en
                                campo de efecto.
                            </span>
                        {/if}
                    </span>
                {/each}
            </div>
        </div>
    {/each}
</section>

<style>
    section {
        width: 100%;
    }

    .error-counter {
        width: 100%;
    }

    .result-image {
        height: 15rem;
    }

    .result {
        margin-top: 0.5rem;
    }

    .name {
        font-weight: bold;
    }

    .text-success {
        color: darkgreen;
    }

    .text-failed {
        color: red;
    }

    .text-carteles {
        color: darkgray;
    }

    .file-errors {
        display: flex;
        flex-direction: column;
    }

    .file-error {
        color: red;
    }

    .ignore-rule {
        color: darkgray;
    }
</style>
