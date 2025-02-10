<script lang="ts">
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";
    import { trimEnd } from "$lib/strings";

    const title: string = text.validarDialogos;

    type LineError = {
        location: string;
        error: string;
        text: string;
        ignoreRule: string;
    };

    type FileResult = {
        fileName: string;
        errors: LineError[];
    };

    let inputFiles = $state<HTMLInputElement>();
    let totalErrors = $state<number>(0);
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
                ignoreRule: "",
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
                ignoreRule: "",
            });
        }

        for (let i = 0; i < file.events.lines.length; i++) {
            const line = file.events.lines[i];
            const lineNumber = i + 1;

            if (line.type == asu.LINE_TYPE_COMMENT) {
                continue;
            }

            if (line.content === "") {
                continue;
            }

            const ignoreList: string[] = line.effect
                .split(" ")
                .filter((x) => x.startsWith("ignorar-"));

            if (ignoreList.includes("ignorar-linea")) {
                continue;
            }

            if (
                !file.styles.styles.some((style) => line.style === style.name)
            ) {
                errors.push({
                    location: `Línea ${lineNumber}`,
                    error: `Estilo no encontrado`,
                    text: line.style,
                    ignoreRule: "ignorar-estilo",
                });
            }

            const items = asu.parseContent(line.content);
            let text = asu.contentsToString(
                items.filter((item) => item.name === "text"),
            );

            if (!ignoreList.includes("ignorar-inicio")) {
                const errorMessage = validarInicio(text);
                if (errorMessage != null) {
                    errors.push({
                        location: `Línea ${lineNumber}`,
                        error: errorMessage,
                        text: line.content,
                        ignoreRule: "ignorar-inicio",
                    });
                }
            }

            if (!ignoreList.includes("ignorar-espacios")) {
                const errorMessage = validarDobleEspacio(text);
                if (errorMessage != null) {
                    errors.push({
                        location: `Línea ${lineNumber}`,
                        error: errorMessage,
                        text: line.content,
                        ignoreRule: "ignorar-espacios",
                    });
                }
            }

            if (!ignoreList.includes("ignorar-fin")) {
                text = trimEnd(text, " ");
                const validSufixes: string[] = [
                    ".",
                    ",",
                    ";",
                    "...",
                    "!",
                    "?",
                    ":",
                    "~",
                    "-...",
                ];

                if (!validSufixes.some((sufix) => text.endsWith(sufix))) {
                    errors.push({
                        location: `Línea ${lineNumber}`,
                        error: `No tiene un fin de línea válido: ${validSufixes.map((x) => `"${x}"`).join(", ")}`,
                        text: line.content,
                        ignoreRule: "ignorar-fin",
                    });
                }
            }
        }

        return errors;
    }

    function validarInicio(text: string): string | null {
        if (text.startsWith("... ")) {
            return "los tres puntos van pegados";
        }

        if (text.startsWith("...")) {
            text = text.substring("...".length);
        }

        const re = /^(-\s|¡|¿|")*[A-zÁÉÍÓÚáéíóú0-9ñÑ]/gm;

        if (!re.test(text)) {
            return "inicio inválido";
        }

        return null;
    }

    function validarDobleEspacio(text: string): string | null {
        if (text.includes("  ")) {
            return "hay dos espacios seguidos";
        }

        return null;
    }

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

            const fileErrors = validateSubs(assFile);
            totalErrors += fileErrors.length;
            results.push({
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

    <input
        bind:this={inputFiles}
        type="file"
        accept=".ass"
        onchange={handleFiles}
        multiple
    />

    {#if results.length > 0}
        <div class="text-{totalErrors == 0 ? 'success' : 'failed'} mt-2">
            <b>
                Errores detectados: {totalErrors}
            </b>
        </div>
    {/if}

    {#each results as result}
        <div class="result">
            <span
                class="name text-{result.errors.length == 0
                    ? 'success'
                    : 'failed'}"
            >
                {result.fileName}
            </span>

            {#if result.errors.length == 0}
                <div class="text-success">¡Todo en orden!</div>
            {/if}

            <div class="file-errors">
                {#each result.errors as error}
                    <span class="file-error">
                        {error.location}: {error.error}.

                        <textarea
                            class="textarea is-danger"
                            value={error.text}
                            readonly
                            rows="1"
                        ></textarea>

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

    .ignore-rule {
        color: darkgray;
    }
</style>
