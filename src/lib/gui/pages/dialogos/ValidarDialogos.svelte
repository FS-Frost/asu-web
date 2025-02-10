<script lang="ts">
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";

    const title: string = text.validarDialogos;

    type LineError = {
        location: string;
        error: string;
        text: string;
    };

    type FileResult = {
        fileName: string;
        errors: LineError[];
    };

    let inputFiles = $state<HTMLInputElement>();
    let results = $state<FileResult[]>([]);

    function validateSubs(file: asu.ASSFile): LineError[] {
        const errors: LineError[] = [];

        const wrapStyle = file.scriptInfo.properties.get("WrapStyle") ?? "";
        const expectedWrapStyle = "0";
        if (wrapStyle !== expectedWrapStyle) {
            errors.push({
                location: "Script info, wrap style",
                error: `Se esperaba "${expectedWrapStyle}", pero se encontró "${wrapStyle}"`,
                text: wrapStyle,
            });
        }

        const scaledBorderAndShadow =
            file.scriptInfo.properties.get("ScaledBorderAndShadow") ?? "";

        const expectedScaledBorderAndShadow = "yes";
        if (scaledBorderAndShadow !== expectedScaledBorderAndShadow) {
            errors.push({
                location: "Script info, scaled border and shadow",
                error: `Se esperaba "${expectedScaledBorderAndShadow}", pero se encontró "${scaledBorderAndShadow}"`,
                text: scaledBorderAndShadow,
            });
        }

        for (let i = 0; i < file.events.lines.length; i++) {
            const line = file.events.lines[i];
            const lineNumber = i + 1;

            if (line.content === "") {
                continue;
            }

            if (
                !file.styles.styles.some((style) => line.style === style.name)
            ) {
                errors.push({
                    location: `Línea ${lineNumber}`,
                    error: `Estilo "${line.style}" no encontrado`,
                    text: "",
                });
            }

            const items = asu.parseContent(line.content);
            const text = asu.contentsToString(
                items.filter((item) => item.name === "text"),
            );

            const validSufixes: string[] = [".", ",", "...", "!", "?", ":"];

            if (!validSufixes.some((sufix) => text.endsWith(sufix))) {
                errors.push({
                    location: `Línea ${lineNumber}`,
                    error: `No tiene un fin de línea válido: ${validSufixes.map((x) => `"${x}"`).join(", ")}`,
                    text: line.content,
                });
            }
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
                {#each result.errors as error}
                    <span class="file-error">
                        {error.location}: {error.error}

                        <textarea
                            class="textarea is-danger"
                            value={error.text}
                            readonly
                            rows="1"
                        ></textarea>
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

    textarea {
        width: 100%;
    }
</style>
