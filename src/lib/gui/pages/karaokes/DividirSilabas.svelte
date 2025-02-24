<script lang="ts">
    import { onMount } from "svelte";
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";

    const title: string = text.dividirSilabas;

    let errorMessage = $state<string>("");
    let placeholder = $state<string>("");
    let rawTargetLines = $state<string>("");
    let rawResultLines = $state<string>("");

    function processLines(): void {
        errorMessage = "";
        rawResultLines = "";

        if (rawTargetLines.length == 0) {
            return;
        }

        const targetLines: string[] = rawTargetLines.split("\n");
        let result = "";

        for (let i = 0; i < targetLines.length; i++) {
            const rawLine = targetLines[i];
            if (rawLine.length == 0) {
                continue;
            }

            const line = asu.parseLine(rawLine);
            if (line == null) {
                errorMessage = `Subtítulos, línea ${i + 1} inválida: '${rawLine}'`;
                break;
            }

            asu.splitSyllabes(line);
            const rawResult = asu.lineToString(line);

            if (i > 0) {
                result += "\n";
            }

            result += rawResult;
        }

        rawResultLines = result;
    }

    async function copyResult(): Promise<void> {
        await navigator.clipboard.writeText(rawResultLines);
        alert("¡Líneas copiadas al portapapeles!");
    }

    onMount(() => {
        placeholder += `Comment: 0,0:01:15.11,0:01:17.74,Romaji,,0,0,0,karaoke,dareka wo mamoreru watashi ni natte\n`;

        placeholder += `Comment: 0,0:01:17.85,0:01:20.44,Romaji,,0,0,0,karaoke,mune wo hatte itsuka omoerun da\n`;

        placeholder += `Comment: 0,0:01:20.58,0:01:30.42,Romaji,,0,0,0,karaoke,ano hi kimi ni deaete yokatta\n`;

        rawTargetLines = placeholder;
        processLines();
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section>
    <h1>{title}</h1>

    {#if errorMessage != ""}
        <div class="mt-2 mb-2 has-text-danger">
            {errorMessage}
        </div>
    {/if}

    <div class="field">
        <label class="label" for="">
            {text.subtitulos} (romaji)
        </label>

        <div class="control">
            <textarea
                bind:value={rawTargetLines}
                class="textarea"
                {placeholder}
                oninput={processLines}
            ></textarea>
        </div>
    </div>

    <div class="field mt-2">
        <label class="label" for="">
            {text.resultado}
            <i
                class="fa-solid fa-copy clickable"
                role="button"
                tabindex="0"
                title="Copiar"
                onclick={() => copyResult()}
                onkeydown={() => {}}
            ></i>
        </label>
        <div class="control">
            <textarea bind:value={rawResultLines} class="textarea" readonly
            ></textarea>
        </div>
    </div>
</section>

<style>
    section {
        width: 100%;
    }
</style>
