<script lang="ts">
    import FileError from "./FileError.svelte";
    import Promt from "./Promt.svelte";
    import type { FileResult } from "$lib/subtitleValidationService";

    type Props = {
        result: FileResult;
    };

    let { result = $bindable() }: Props = $props();

    function generateResultColorClass(result: FileResult): string {
        if (result.errors.length > 0) {
            return "has-text-danger";
        }

        if (result.warnings.length > 0) {
            return "has-text-warning";
        }

        return "has-text-success";
    }
</script>

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

    {#if result.promt != ""}
        <Promt promt={result.promt}></Promt>
    {/if}
</div>

<style>
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

    .errors-list,
    .warnings-list {
        margin-top: 0.5rem;
    }

    .errors-list button,
    .warnings-list button {
        width: 15rem;
    }
</style>
