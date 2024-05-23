<script lang="ts">
    import { onMount } from "svelte";
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";

    const title: string = text.aplicarSecuenciaPosiciones;

    let rawBaseLines: string = "";
    let rawTargetLines: string = "";
    let rawResultLines: string = "";
    let reverseLinesEnabled: boolean = false;

    function processLines(): void {
        if (rawTargetLines.length == 0) {
            alert("Pega las líneas desde Aegisub para continuar.");
            return;
        }

        const baseLines: asu.Line[] = [];
        {
            const rawLines = rawBaseLines.split("\n");
            for (const rawLine of rawLines) {
                if (rawLine.length == 0) {
                    continue;
                }

                const line = asu.parseLine(rawLine);
                if (line == null) {
                    continue;
                }

                const items = asu.parseContent(line.content);
                const tagPos = asu.findPos(items);
                if (tagPos == null) {
                    alert(`Línea base sin \\pos copiada: '${rawLine}'`);
                    console.log(rawLine);
                    return;
                }

                baseLines.push(line);
            }
        }

        const firstLineDeltaXY: [number, number] = [0, 0];
        const deltasXY: [number, number][] = [firstLineDeltaXY];
        for (let i = 0; i < baseLines.length - 1; i++) {
            const line1 = baseLines[i];
            const line2 = baseLines[i + 1];

            const itemsLine1 = asu.parseContent(line1.content);
            const tagPos1 = asu.findPos(itemsLine1);
            if (tagPos1 == null) {
                alert(`Línea base sin \\pos: '${asu.lineToString(line1)}'`);
                console.log(line1);
                return;
            }

            const itemsLine2 = asu.parseContent(line2.content);
            const tagPos2 = asu.findPos(itemsLine2);
            if (tagPos2 == null) {
                alert(`Línea base sin \\pos: '${asu.lineToString(line2)}'`);
                console.log(line2);
                return;
            }

            const deltaX = tagPos2.x - tagPos1.x;
            const deltaY = tagPos2.y - tagPos1.y;
            deltasXY.push([deltaX, deltaY]);
        }

        const targetLines: asu.Line[] = [];
        {
            const rawLines = rawTargetLines.split("\n");
            for (const rawLine of rawLines) {
                if (rawLine.length == 0) {
                    continue;
                }

                const line = asu.parseLine(rawLine);
                if (line == null) {
                    continue;
                }

                const items = asu.parseContent(line.content);
                const tagPos = asu.findPos(items);
                if (tagPos == null) {
                    alert(`Línea objetivo sin \\pos: '${rawLine}'`);
                    console.log(rawLine);
                    return;
                }

                targetLines.push(line);
            }
        }

        let result = "";
        for (let i = 0; i < targetLines.length; i++) {
            const targetLine = targetLines[i];
            const targetItems = asu.parseContent(targetLine.content);
            const targetTagPos = asu.findPos(targetItems);
            if (targetTagPos == null) {
                const rawLine = asu.lineToString(targetLine);
                alert(`Línea objetivo sin \\pos: '${rawLine}'`);
                console.log(rawLine);
                return;
            }

            let refPosX = targetTagPos.x;
            let refPosY = targetTagPos.y;

            for (let u = 0; u < baseLines.length; u++) {
                const deltaX = deltasXY[u][0];
                const deltaY = deltasXY[u][1];
                const newPosX = refPosX + deltaX;
                const newPosY = refPosY + deltaY;
                refPosX = newPosX;
                refPosY = newPosY;
                asu.setPos(targetItems, newPosX, newPosY);
                targetLine.content = asu.contentsToString(targetItems);

                const baseLine = baseLines[u];
                targetLine.start = baseLine.start;
                targetLine.end = baseLine.end;

                if (u > 0) {
                    result += "\n";
                }

                result += asu.lineToString(targetLine);
            }
        }

        rawResultLines = result;
    }

    async function copyResult(): Promise<void> {
        await navigator.clipboard.writeText(rawResultLines);
        alert("¡Líneas copiadas al portapapeles!");
    }

    onMount(() => {
        rawBaseLines += `Dialogue: 1,0:23:58.04,0:23:58.08,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\pos(635.6,49.8)\\frx4\\fry354}Tama:\n`;

        rawBaseLines += `Dialogue: 1,0:23:58.08,0:23:58.12,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\pos(635.55,45.69)\\frx4\\fry354}Tama:\n`;

        rawBaseLines += `Dialogue: 1,0:23:58.12,0:23:58.16,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\pos(635.56,41.4)\\frx4\\fry354}Tama:\n`;

        rawBaseLines += `Dialogue: 1,0:23:58.16,0:23:58.20,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\pos(635.41,37.09)\\frx4\\fry354}Tama:\n`;

        rawBaseLines += `Dialogue: 1,0:23:58.20,0:23:58.24,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\pos(635.31,32.78)\\frx4\\fry354}Tama:\n`;

        rawBaseLines += `Dialogue: 1,0:23:58.24,0:23:58.29,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\pos(635.22,28.39)\\frx4\\fry354}Tama:\n`;

        rawBaseLines += `Dialogue: 1,0:23:58.29,0:23:58.33,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\pos(635.06,24.18)\\frx4\\fry354}Tama:\n`;

        rawBaseLines += `Dialogue: 1,0:23:58.33,0:23:58.37,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\pos(635.13,19.34)\\frx4\\fry354}Tama:\n`;

        rawBaseLines += `Dialogue: 1,0:23:58.37,0:23:58.41,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\pos(634.99,14.77)\\frx4\\fry354}Tama:\n`;

        rawBaseLines += `Dialogue: 1,0:23:58.41,0:23:58.45,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\pos(634.96,10.13)\\frx4\\fry354}Tama:`;

        rawTargetLines =
            "Dialogue: 0,0:00:00.00,0:00:00.02,Default,,0,0,0,,{\\fs42\\bord3\\shad0\\pos(328,472.286)}TEXTO";
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section>
    <h1 class="title is-5">{title}</h1>

    <div class="field">
        <label class="label" for=""> Secuencia de posiciones </label>

        <div class="control">
            <textarea
                bind:value={rawBaseLines}
                class="textarea"
                placeholder="Pega tus líneas aquí"
            ></textarea>
        </div>
    </div>

    <label class="checkbox reverse">
        <input type="checkbox" bind:checked={reverseLinesEnabled} />
        Aplicar inversamente
    </label>

    <div class="field">
        <label class="label" for="">
            {text.subtitulos}
        </label>

        <div class="control">
            <textarea
                bind:value={rawTargetLines}
                class="textarea"
                placeholder="Pega tus líneas aquí"
            ></textarea>
        </div>
    </div>

    <button class="button is-link is-fullwidth" on:click={() => processLines()}>
        {text.aplicarSecuenciaPosiciones}
    </button>

    <div class="field mt-2">
        <label class="label" for="">
            {text.resultado}
            <i
                class="fa-solid fa-copy clickable"
                role="button"
                tabindex="0"
                title="Copiar"
                on:click={() => copyResult()}
                on:keydown={() => {}}
            />
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
