<script lang="ts">
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";
    import { trimEnd } from "$lib/strings";
    import SubsArea from "./SubsArea.svelte";

    const title: string = text.validarDialogos;

    const subsModes = [
        "automático",
        "carteles",
        "diálogos",
        "karaokes",
    ] as const;

    type SubsMode = (typeof subsModes)[number];

    type LineError = {
        location: string;
        error: string;
        text: string;
        ignoreRule: string;
    };

    type FileResult = {
        subsType: string;
        fileName: string;
        errors: LineError[];
    };

    let userSubsMode = $state<SubsMode>("automático");
    let actualSubsMode = $state<SubsMode>("diálogos");
    let inputFiles = $state<HTMLInputElement>();
    let totalErrors = $state<number>(0);
    let results = $state<FileResult[]>([]);

    function validateSubs(file: asu.ASSFile): LineError[] {
        const errors: LineError[] = [];

        if (actualSubsMode === "carteles") {
            errors.push({
                location: "Modo",
                error: `El modo ${actualSubsMode} no está soportado`,
                text: "",
                ignoreRule: "",
            });

            return errors;
        }

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

        let totalKaraokeLines = 0;

        for (let i = 0; i < file.events.lines.length; i++) {
            const line = file.events.lines[i];
            const lineNumber = i + 1;

            if (
                actualSubsMode !== "karaokes" &&
                line.effect.includes("template syl")
            ) {
                console.info(
                    `template syl detectado en línea ${lineNumber}, pasando a modo karaokes`,
                );

                actualSubsMode = "karaokes";
                continue;
            }

            if (
                actualSubsMode == "diálogos" &&
                line.type == asu.LINE_TYPE_COMMENT
            ) {
                continue;
            }

            if (line.content === "") {
                continue;
            }

            if (actualSubsMode === "karaokes" && line.style !== "Español") {
                continue;
            }

            if (
                actualSubsMode === "karaokes" &&
                line.type !== asu.LINE_TYPE_COMMENT
            ) {
                continue;
            }

            if (actualSubsMode === "karaokes" && line.effect !== "karaoke") {
                continue;
            }

            if (actualSubsMode === "karaokes" && line.effect === "fx") {
                break;
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

            if (actualSubsMode === "karaokes") {
                totalKaraokeLines++;
            }
        }

        if (actualSubsMode === "karaokes" && totalKaraokeLines === 0) {
            errors.push({
                location: `Línea ${file.events.lines.length}`,
                error: "No se encontraron líneas de karaoke en español",
                text: "",
                ignoreRule: "",
            });
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

        const re = /^(-\s|¡|¿|"|“)*[A-zÁÉÍÓÚáéíóú0-9ñÑ]/gm;

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

            actualSubsMode = detectSubsMode(file.name, userSubsMode);

            const fileErrors = validateSubs(assFile);
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

    function detectSubsMode(
        fileName: string,
        userSubsMode: SubsMode,
    ): SubsMode {
        if (userSubsMode !== "automático") {
            return userSubsMode;
        }

        fileName = fileName.toLocaleLowerCase();

        if (fileName.includes("carteles")) {
            return "carteles";
        }

        if (fileName.includes("subs")) {
            return "diálogos";
        }

        if (fileName.includes("karaoke")) {
            return "karaokes";
        }

        return "diálogos";
    }
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section>
    <h1>{title}</h1>

    <div class="select is-fullwidth mb-2">
        <select bind:value={userSubsMode}>
            {#each subsModes as mode}
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
                    : 'failed'}"
            >
                {result.fileName}
            </span>

            {#if result.errors.length == 0}
                <div class="text-success">
                    ¡Todo en orden! Detectado como {result.subsType}.
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
