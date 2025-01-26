<script lang="ts">
    import { onMount } from "svelte";
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";

    const title: string = text.dividirSilabas;

    let rawTargetLines = $state<string>("");
    let rawResultLines = $state<string>("");

    function processLines(): void {
        if (rawTargetLines.length == 0) {
            alert("Pega las líneas desde Aegisub para continuar.");
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
                console.error(`line ${i + 1}: invalid line`);
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
        rawTargetLines += `Comment: 0,0:01:15.11,0:01:17.74,Romaji,,0,0,0,karaoke,dareka wo mamoreru watashi ni natte\n`;

        rawTargetLines += `Comment: 0,0:01:17.85,0:01:20.44,Romaji,,0,0,0,karaoke,mune wo hatte itsuka omoerun da\n`;

        rawTargetLines += `Comment: 0,0:01:20.58,0:01:30.42,Romaji,,0,0,0,karaoke,ano hi kimi ni deaete yokatta\n`;
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section>
    <h1 class="title is-5">{title}</h1>

    <div class="field">
        <label class="label" for="">
            {text.subtitulos} (romaji)
        </label>

        <div class="control">
            <textarea
                bind:value={rawTargetLines}
                class="textarea"
                placeholder="Pega tus líneas aquí"
            ></textarea>
        </div>
    </div>

    <button class="button is-link is-fullwidth" onclick={() => processLines()}>
        {text.dividirSilabas}
    </button>

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
            <textarea bind:value={rawResultLines} class="textarea"></textarea>
        </div>
    </div>
</section>

<style>
    section {
        width: 100%;
    }
</style>
