<script lang="ts">
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";

    const title: string = text.validarDialogos;

    type FileResult = {
        fileName: string;
        errors: string[];
    };

    let inputFiles = $state<HTMLInputElement>();
    let results = $state<FileResult[]>([]);

    function validateSubs(file: asu.ASSFile): string[] {
        const errors: string[] = [];

        const wrapStyle = file.scriptInfo.properties.get("WrapStyle") ?? "";
        const expectedWrapStyle = "0";
        if (wrapStyle !== expectedWrapStyle) {
            errors.push(
                `script info, wrap style: se esperaba "${expectedWrapStyle}", pero se encontró "${wrapStyle}"`,
            );
        }

        const scaledBorderAndShadow =
            file.scriptInfo.properties.get("ScaledBorderAndShadow") ?? "";

        const expectedScaledBorderAndShadow = "yes";
        if (scaledBorderAndShadow !== expectedScaledBorderAndShadow) {
            errors.push(
                `script info, scaled border and shadow: se esperaba "${expectedScaledBorderAndShadow}", pero se encontró "${scaledBorderAndShadow}"`,
            );
        }

        return errors;
    }

    async function handleFiles(): Promise<void> {
        const files = [...(inputFiles?.files ?? [])];
        results = [];

        for (const file of files) {
            const content = await file.text();
            const assFile = asu.parseASSFile(content);
            if (assFile == null) {
                console.error("archivo inválido", file.name);
                continue;
            }

            const error = validateSubs(assFile);
            results.push({
                fileName: file.name,
                errors: error,
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
    <h1 class="title is-5">{title}</h1>

    <input
        bind:this={inputFiles}
        type="file"
        accept=".ass"
        onchange={handleFiles}
        multiple
    />

    {#each results as result}
        <div class="result">
            <span
                class="name {result.errors.length == 0 ? 'success' : 'failed'}"
            >
                {result.fileName}
            </span>

            <div class="file-errors">
                {#each result.errors as error, i}
                    <span class="file-error">
                        {i + 1}. {error}
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

    .result {
        margin-top: 0.5rem;
    }

    .name {
        font-weight: bold;
    }

    .name.success {
        color: darkgreen;
    }

    .name.failed {
        color: red;
    }

    .file-errors {
        display: flex;
        flex-direction: column;
    }

    .file-error {
        color: red;
    }
</style>
