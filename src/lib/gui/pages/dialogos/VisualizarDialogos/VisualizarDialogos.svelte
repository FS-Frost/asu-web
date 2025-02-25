<script lang="ts">
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";
    import Editor from "./Editor.svelte";

    const title: string = text.visualizarDialogos;

    let inputFiles = $state<HTMLInputElement>();
    let loadedFile = $state<asu.ASSFile>(asu.generateDefaultASSFile());
    let loadedFileName = $state<string>("ejemplo.ass");

    async function handleFiles(): Promise<void> {
        try {
            const files = [...(inputFiles?.files ?? [])];
            if (files.length == 0) {
                return;
            }

            const file = files[0];
            const content = await file.text();
            const userAssFile = asu.parseASSFile(content);
            if (userAssFile == null) {
                console.error("archivo inválido", file.name);
                return;
            }

            loadedFile = userAssFile;
            loadedFileName = file.name;
        } catch (error) {
            console.error("error al procesa el archivo", error);
        }
    }
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section class="editor-dialogos">
    <h1>{title}</h1>

    <div class="file is-fullwidth mb-2">
        <label class="file-label">
            <input
                class="file-input"
                type="file"
                bind:this={inputFiles}
                accept=".ass"
                onchange={handleFiles}
            />
            <span class="file-cta">
                <span class="file-icon">
                    <i class="fas fa-upload"></i>
                </span>
                <span class="file-label"> Cargar subtítulos </span>
            </span>
        </label>
    </div>

    <div class="loaded-file">
        Archivo cargado: {loadedFileName}
    </div>

    <Editor bind:file={loadedFile}></Editor>
</section>

<style>
    section {
        width: 100%;
    }

    .loaded-file {
        font-weight: bold;
    }
</style>
