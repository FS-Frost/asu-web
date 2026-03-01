<script lang="ts">
    import { onMount } from "svelte";
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";

    const title: string = text.aplicarSecuenciaPosiciones;

    let rawBaseLines = $state<string>("");
    let rawTargetLines = $state<string>("");
    let rawResultLines = $state<string>("");
    let reverseLinesEnabled = $state<boolean>(false);
    let errorMessage = $state<string>("");
    let posEnabled = $state<boolean>(true);
    let frzEnabled = $state<boolean>(false);

    $effect(() => {
        processLines(rawBaseLines, rawTargetLines, reverseLinesEnabled);
    });

    function processLines(rawBaseLines: string, rawTargetLines: string, reverseLinesEnabled: boolean): void {
        errorMessage = "";
        rawResultLines = "";

        if (rawTargetLines.length == 0) {
            return;
        }

        const baseLines: asu.Line[] = [];
        {
            const rawLines = rawBaseLines.split("\n");
            for (let i = 0; i < rawLines.length; i++) {
                const rawLine = rawLines[i];
                if (rawLine.length == 0) {
                    continue;
                }

                const line = asu.parseLine(rawLine);
                if (line == null) {
                    continue;
                }

                baseLines.push(line);
            }
        }

        const targetLines: asu.Line[] = [];
        {
            const rawLines = rawTargetLines.split("\n");
            for (let i = 0; i < rawLines.length; i++) {
                const rawLine = rawLines[i];
                if (rawLine.length == 0) {
                    continue;
                }

                const line = asu.parseLine(rawLine);
                if (line == null) {
                    continue;
                }

                targetLines.push(line);
            }
        }

        let result = "";

        for (let i = 0; i < targetLines.length; i++) {
            const targetLine = targetLines[i];
            const targetItems = asu.parseContent(targetLine.content);

            if (reverseLinesEnabled) {
                baseLines.reverse();
            }

            const refPos = asu.findPos(targetItems);
            const refFrz = asu.findFrz(targetItems) ?? { name: asu.TagName.frz, value: 0 };
            const deltaMatrix = calculateDeltaMatrix(baseLines);
            const finalLines: asu.Line[] = [];

            for (let u = 0; u < baseLines.length; u++) {
                const deltaPos = deltaMatrix.pos[u];

                if (posEnabled && refPos && deltaPos) {
                    applyDeltaPos(refPos, targetItems, deltaPos);
                }

                const deltaFrz = deltaMatrix.frz[u];

                if (frzEnabled && refFrz && deltaFrz) {
                    applyDeltaFrz(refFrz, targetItems, deltaFrz);
                }

                targetLine.content = asu.contentsToString(targetItems);

                const baseLine = baseLines[u];
                targetLine.start = baseLine.start;
                targetLine.end = baseLine.end;

                finalLines.push(structuredClone(targetLine));
            }

            if (reverseLinesEnabled) {
                baseLines.reverse();
                finalLines.reverse();
            }

            for (const finalLine of finalLines) {
                result += asu.lineToString(finalLine) + "\n";
            }
        }

        rawResultLines = result;
    }

    type DeltaPos = {
        x: number;
        y: number;
    };

    type DeltaRotation = {
        value: number;
    };

    type DeltaMatrix = {
        pos: DeltaPos[];
        frz: DeltaRotation[];
    };

    function calculateDeltaMatrix(baseLines: asu.Line[]): DeltaMatrix {
        const matrix: DeltaMatrix = {
            pos: [],
            frz: [],
        };

        matrix.pos.push({ x: 0, y: 0 });
        matrix.frz.push({ value: 0 });

        for (let i = 0; i < baseLines.length - 1; i++) {
            const line1 = baseLines[i];
            const line2 = baseLines[i + 1];

            const itemsLine1 = asu.parseContent(line1.content);
            const itemsLine2 = asu.parseContent(line2.content);

            calculateDeltaPos(matrix, itemsLine1, itemsLine2);
            calculateDeltaFrz(matrix, itemsLine1, itemsLine2);
        }

        return matrix;
    }

    function calculateDeltaPos(matrix: DeltaMatrix, items1: asu.ContentItem[], items2: asu.ContentItem[]): void {
        const tagPos1 = asu.findPos(items1);
        if (tagPos1 == null) {
            return;
        }

        const tagPos2 = asu.findPos(items2);
        if (tagPos2 == null) {
            return;
        }

        const deltaX = tagPos2.x - tagPos1.x;
        const deltaY = tagPos2.y - tagPos1.y;

        matrix.pos.push({ x: deltaX, y: deltaY });
    }

    function calculateDeltaFrz(matrix: DeltaMatrix, items1: asu.ContentItem[], items2: asu.ContentItem[]): void {
        const tagFrz1 = asu.findFrz(items1);
        if (tagFrz1 == null) {
            return;
        }

        const tagFrz2 = asu.findFrz(items2);
        if (tagFrz2 == null) {
            return;
        }

        const delta = tagFrz2.value - tagFrz1.value;
        matrix.frz.push({ value: delta });
    }

    function applyDeltaPos(ref: asu.TagPos, targetItems: asu.ContentItem[], delta: DeltaPos): void {
        const newX = ref.x + delta.x;
        const newY = ref.y + delta.y;

        ref.x = newX;
        ref.y = newY;

        asu.setPos(targetItems, newX, newY);
    }

    function applyDeltaFrz(ref: asu.TagFrz, targetItems: asu.ContentItem[], delta: DeltaRotation): void {
        let newValue = ref.value + delta.value;

        if (newValue < 0) {
            newValue = 360 + newValue;
        }

        ref.value = newValue;

        asu.setFrz(targetItems, newValue);
    }

    async function copyResult(): Promise<void> {
        await navigator.clipboard.writeText(rawResultLines);
        alert("¡Líneas copiadas al portapapeles!");
    }

    function showExample(): void {
        rawBaseLines += "Dialogue: 1,0:23:58.04,0:23:58.08,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.6,593.8)}Tama:\n";

        rawBaseLines += "Dialogue: 1,0:23:58.08,0:23:58.12,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.55,589.69)}Tama:\n";

        rawBaseLines += "Dialogue: 1,0:23:58.12,0:23:58.16,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.56,585.4)}Tama:\n";

        rawBaseLines += "Dialogue: 1,0:23:58.16,0:23:58.20,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.41,581.09)}Tama:\n";

        rawBaseLines += "Dialogue: 1,0:23:58.20,0:23:58.24,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.31,576.78)}Tama:\n";

        rawBaseLines += "Dialogue: 1,0:23:58.24,0:23:58.29,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.22,572.39)}Tama:\n";

        rawBaseLines += "Dialogue: 1,0:23:58.29,0:23:58.33,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.06,568.18)}Tama:\n";

        rawBaseLines += "Dialogue: 1,0:23:58.33,0:23:58.37,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.13,563.34)}Tama:\n";

        rawBaseLines += "Dialogue: 1,0:23:58.37,0:23:58.41,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(634.99,558.77)}Tama:\n";

        rawBaseLines += "Dialogue: 1,0:23:58.41,0:23:58.45,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(634.96,554.13)}Tama:";

        // Probar en dummy video de 1920x1080
        // Para probar secuencia normal
        rawTargetLines = "Dialogue: 1,0:23:58.04,0:23:58.08,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(1039.6,593.8)}LINEA";

        // Para probar secuencia inversa
        // rawTargetLines =
        //     "Dialogue: 1,0:23:58.41,0:23:58.45,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(982.96,554.13)}REVERSE";
    }

    onMount(() => {
        showExample();
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section>
    <h1>{title}</h1>

    {#if errorMessage != ""}
        <div class="mt-2 mb-2 has-text-danger">{errorMessage}</div>
    {/if}

    <div class="field">
        <label class="label" for=""> Secuencia de posiciones </label>

        <div class="control">
            <textarea bind:value={rawBaseLines} class="textarea" placeholder="Pega tus líneas aquí"></textarea>
        </div>
    </div>

    <div class="options">
        <label class="checkbox reverse">
            <input type="checkbox" bind:checked={reverseLinesEnabled} />
            Aplicar inversamente
        </label>

        <label class="checkbox reverse">
            <input type="checkbox" bind:checked={posEnabled} />
            \pos
        </label>

        <label class="checkbox reverse">
            <input type="checkbox" bind:checked={frzEnabled} />
            \frz
        </label>
    </div>

    <div class="field">
        <label class="label" for="">
            {text.subtitulos}
        </label>

        <div class="control">
            <textarea bind:value={rawTargetLines} class="textarea" placeholder="Pega tus líneas aquí"></textarea>
        </div>
    </div>

    <div class="field mt-2">
        <label class="label" for="">
            {text.resultado}
            <i class="fa-solid fa-copy clickable" role="button" tabindex="0" title="Copiar" onclick={() => copyResult()} onkeydown={() => {}}></i>
        </label>
        <div class="control">
            <textarea bind:value={rawResultLines} class="textarea" readonly></textarea>
        </div>
    </div>
</section>

<style>
    section {
        width: 100%;
    }
</style>
