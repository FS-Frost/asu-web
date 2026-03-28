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
    let frxEnabled = $state<boolean>(false);
    let fryEnabled = $state<boolean>(false);
    let bordEnabled = $state<boolean>(false);
    let shadEnabled = $state<boolean>(false);
    let fsEnabled = $state<boolean>(false);

    $effect(() => {
        processLines(rawBaseLines, rawTargetLines, reverseLinesEnabled);
    });

    function processLines(
        rawBaseLines: string,
        rawTargetLines: string,
        reverseLinesEnabled: boolean,
    ): void {
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

            const refFrz = asu.findFrz(targetItems) ?? {
                name: asu.TagName.frz,
                value: 0,
            };

            const refFrx = asu.findFrx(targetItems) ?? {
                name: asu.TagName.frx,
                value: 0,
            };

            const refFry = asu.findFry(targetItems) ?? {
                name: asu.TagName.fry,
                value: 0,
            };

            const refBord = asu.findBord(targetItems) ?? {
                name: asu.TagName.bord,
                value: 0,
            };

            const refShad = asu.findShad(targetItems) ?? {
                name: asu.TagName.shad,
                value: 0,
            };

            const refFs = asu.findFs(targetItems) ?? {
                name: asu.TagName.fs,
                value: 0,
            };

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

                const deltaFrx = deltaMatrix.frx[u];

                if (frxEnabled && refFrx && deltaFrx) {
                    applyDeltaFrx(refFrx, targetItems, deltaFrx);
                }

                const deltaFry = deltaMatrix.fry[u];

                if (fryEnabled && refFry && deltaFry) {
                    applyDeltaFry(refFry, targetItems, deltaFry);
                }

                const deltaBord = deltaMatrix.bord[u];

                if (bordEnabled && refBord && deltaBord) {
                    applyDeltaBord(refBord, targetItems, deltaBord);
                }

                const deltaShad = deltaMatrix.shad[u];

                if (shadEnabled && refShad && deltaShad) {
                    applyDeltaShad(refShad, targetItems, deltaShad);
                }

                const deltaFs = deltaMatrix.fs[u];

                if (fsEnabled && refFs && deltaFs) {
                    applyDeltaFs(refFs, targetItems, deltaFs);
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
        frx: DeltaRotation[];
        fry: DeltaRotation[];
        bord: DeltaRotation[];
        shad: DeltaRotation[];
        fs: DeltaRotation[];
    };

    function calculateDeltaMatrix(baseLines: asu.Line[]): DeltaMatrix {
        const matrix: DeltaMatrix = {
            pos: [],
            frz: [],
            frx: [],
            fry: [],
            bord: [],
            shad: [],
            fs: [],
        };

        matrix.pos.push({ x: 0, y: 0 });
        matrix.frz.push({ value: 0 });
        matrix.frx.push({ value: 0 });
        matrix.fry.push({ value: 0 });
        matrix.bord.push({ value: 0 });
        matrix.shad.push({ value: 0 });
        matrix.fs.push({ value: 0 });

        for (let i = 0; i < baseLines.length - 1; i++) {
            const line1 = baseLines[i];
            const line2 = baseLines[i + 1];

            const itemsLine1 = asu.parseContent(line1.content);
            const itemsLine2 = asu.parseContent(line2.content);

            calculateDeltaPos(matrix, itemsLine1, itemsLine2);
            calculateDeltaFrz(matrix, itemsLine1, itemsLine2);
            calculateDeltaFrx(matrix, itemsLine1, itemsLine2);
            calculateDeltaFry(matrix, itemsLine1, itemsLine2);
            calculateDeltaBord(matrix, itemsLine1, itemsLine2);
            calculateDeltaShad(matrix, itemsLine1, itemsLine2);
            calculateDeltaFs(matrix, itemsLine1, itemsLine2);
        }

        return matrix;
    }

    function calculateDeltaPos(
        matrix: DeltaMatrix,
        items1: asu.ContentItem[],
        items2: asu.ContentItem[],
    ): void {
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

    function calculateDeltaFrz(
        matrix: DeltaMatrix,
        items1: asu.ContentItem[],
        items2: asu.ContentItem[],
    ): void {
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

    function calculateDeltaFrx(
        matrix: DeltaMatrix,
        items1: asu.ContentItem[],
        items2: asu.ContentItem[],
    ): void {
        const tagFrx1 = asu.findFrx(items1);
        if (tagFrx1 == null) {
            return;
        }

        const tagFrx2 = asu.findFrx(items2);
        if (tagFrx2 == null) {
            return;
        }

        const delta = tagFrx2.value - tagFrx1.value;
        matrix.frx.push({ value: delta });
    }

    function calculateDeltaFry(
        matrix: DeltaMatrix,
        items1: asu.ContentItem[],
        items2: asu.ContentItem[],
    ): void {
        const tagFry1 = asu.findFry(items1);
        if (tagFry1 == null) {
            return;
        }

        const tagFry2 = asu.findFry(items2);
        if (tagFry2 == null) {
            return;
        }

        const delta = tagFry2.value - tagFry1.value;
        matrix.fry.push({ value: delta });
    }

    function calculateDeltaBord(
        matrix: DeltaMatrix,
        items1: asu.ContentItem[],
        items2: asu.ContentItem[],
    ): void {
        const tag1 = asu.findBord(items1);
        if (tag1 == null) {
            return;
        }

        const tag2 = asu.findBord(items2);
        if (tag2 == null) {
            return;
        }

        const delta = tag2.value - tag1.value;
        matrix.bord.push({ value: delta });
    }

    function calculateDeltaShad(
        matrix: DeltaMatrix,
        items1: asu.ContentItem[],
        items2: asu.ContentItem[],
    ): void {
        const tag1 = asu.findShad(items1);
        if (tag1 == null) {
            return;
        }

        const tag2 = asu.findShad(items2);
        if (tag2 == null) {
            return;
        }

        const delta = tag2.value - tag1.value;
        matrix.shad.push({ value: delta });
    }

    function calculateDeltaFs(
        matrix: DeltaMatrix,
        items1: asu.ContentItem[],
        items2: asu.ContentItem[],
    ): void {
        const tag1 = asu.findFs(items1);
        if (tag1 == null) {
            return;
        }

        const tag2 = asu.findFs(items2);
        if (tag2 == null) {
            return;
        }

        const delta = tag2.value - tag1.value;
        matrix.fs.push({ value: delta });
    }

    function applyDeltaPos(
        ref: asu.TagPos,
        targetItems: asu.ContentItem[],
        delta: DeltaPos,
    ): void {
        const newX = ref.x + delta.x;
        const newY = ref.y + delta.y;

        ref.x = newX;
        ref.y = newY;

        asu.setPos(targetItems, newX, newY);
    }

    function applyDeltaFrz(
        ref: asu.TagFrz,
        targetItems: asu.ContentItem[],
        delta: DeltaRotation,
    ): void {
        let newValue = ref.value + delta.value;

        if (newValue < 0) {
            newValue = 360 + newValue;
        }

        ref.value = newValue;

        asu.setFrz(targetItems, newValue);
    }

    function applyDeltaFrx(
        ref: asu.TagFrx,
        targetItems: asu.ContentItem[],
        delta: DeltaRotation,
    ): void {
        let newValue = ref.value + delta.value;

        if (newValue < 0) {
            newValue = 360 + newValue;
        }

        ref.value = newValue;

        asu.setFrx(targetItems, newValue);
    }

    function applyDeltaFry(
        ref: asu.TagFry,
        targetItems: asu.ContentItem[],
        delta: DeltaRotation,
    ): void {
        let newValue = ref.value + delta.value;

        if (newValue < 0) {
            newValue = 360 + newValue;
        }

        ref.value = newValue;

        asu.setFry(targetItems, newValue);
    }

    function applyDeltaBord(
        ref: asu.TagBord,
        targetItems: asu.ContentItem[],
        delta: DeltaRotation,
    ): void {
        const newValue = ref.value + delta.value;
        ref.value = newValue;
        asu.setBord(targetItems, newValue);
    }

    function applyDeltaShad(
        ref: asu.TagShad,
        targetItems: asu.ContentItem[],
        delta: DeltaRotation,
    ): void {
        const newValue = ref.value + delta.value;
        ref.value = newValue;
        asu.setShad(targetItems, newValue);
    }

    function applyDeltaFs(
        ref: asu.TagFs,
        targetItems: asu.ContentItem[],
        delta: DeltaRotation,
    ): void {
        const newValue = ref.value + delta.value;
        ref.value = newValue;
        asu.setFs(targetItems, newValue);
    }

    async function copyResult(): Promise<void> {
        await navigator.clipboard.writeText(rawResultLines);
        alert("¡Líneas copiadas al portapapeles!");
    }

    function showExample(): void {
        rawBaseLines +=
            "Dialogue: 1,0:23:58.04,0:23:58.08,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.6,593.8)}Tama:\n";

        rawBaseLines +=
            "Dialogue: 1,0:23:58.08,0:23:58.12,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.55,589.69)}Tama:\n";

        rawBaseLines +=
            "Dialogue: 1,0:23:58.12,0:23:58.16,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.56,585.4)}Tama:\n";

        rawBaseLines +=
            "Dialogue: 1,0:23:58.16,0:23:58.20,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.41,581.09)}Tama:\n";

        rawBaseLines +=
            "Dialogue: 1,0:23:58.20,0:23:58.24,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.31,576.78)}Tama:\n";

        rawBaseLines +=
            "Dialogue: 1,0:23:58.24,0:23:58.29,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.22,572.39)}Tama:\n";

        rawBaseLines +=
            "Dialogue: 1,0:23:58.29,0:23:58.33,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.06,568.18)}Tama:\n";

        rawBaseLines +=
            "Dialogue: 1,0:23:58.33,0:23:58.37,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(635.13,563.34)}Tama:\n";

        rawBaseLines +=
            "Dialogue: 1,0:23:58.37,0:23:58.41,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(634.99,558.77)}Tama:\n";

        rawBaseLines +=
            "Dialogue: 1,0:23:58.41,0:23:58.45,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(634.96,554.13)}Tama:";

        // Probar en dummy video de 1920x1080
        // Para probar secuencia normal
        rawTargetLines =
            "Dialogue: 1,0:23:58.04,0:23:58.08,Cartel,,0,0,0,,{\\fax-0.1\\fs56\\an4\\1c&H1E2357&\\3c&HF4F4F4&\\bord0\\blur0.4\\frz354.6\\frx4\\fry354\\pos(1039.6,593.8)}LINEA";

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
            <textarea
                bind:value={rawBaseLines}
                class="textarea"
                placeholder="Pega tus líneas aquí"
            ></textarea>
        </div>
    </div>

    <label class="label" for=""> Configuración </label>

    <div class="options-container">
        <div class="option-group">
            <div class="chips-grid">
                <label class="chip" class:active={reverseLinesEnabled}>
                    <input type="checkbox" bind:checked={reverseLinesEnabled} />
                    <span>Inversamente</span>
                </label>

                <label class="chip" class:active={bordEnabled}>
                    <input type="checkbox" bind:checked={bordEnabled} />
                    <span>\bord</span>
                </label>

                <label class="chip" class:active={frxEnabled}>
                    <input type="checkbox" bind:checked={frxEnabled} />
                    <span>\frx</span>
                </label>

                <label class="chip" class:active={fryEnabled}>
                    <input type="checkbox" bind:checked={fryEnabled} />
                    <span>\fry</span>
                </label>

                <label class="chip" class:active={frzEnabled}>
                    <input type="checkbox" bind:checked={frzEnabled} />
                    <span>\frz</span>
                </label>

                <label class="chip" class:active={fsEnabled}>
                    <input type="checkbox" bind:checked={fsEnabled} />
                    <span>\fs</span>
                </label>

                <label class="chip" class:active={posEnabled}>
                    <input type="checkbox" bind:checked={posEnabled} />
                    <span>\pos</span>
                </label>

                <label class="chip" class:active={shadEnabled}>
                    <input type="checkbox" bind:checked={shadEnabled} />
                    <span>\shad</span>
                </label>
            </div>
        </div>
    </div>

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

    .options-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        margin-bottom: 0.5rem;
    }

    .option-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .chips-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .chip {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.9rem;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
        font-weight: 600;
        font-size: 0.85rem;
    }

    .chip:hover {
        border-color: #cbd5e1;
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    }

    .chip.active {
        background: #6366f1;
        border-color: #6366f1;
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }

    .chip input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .clickable:hover {
        color: #6366f1;
        background: #f1f5f9;
    }

    .has-text-danger {
        background: #fef2f2;
        color: #dc2626;
        padding: 0.75rem;
        border-radius: 8px;
        border: 1px solid #fee2e2;
        font-size: 0.85rem;
        font-weight: 500;
        margin: 1rem 0;
    }
</style>
