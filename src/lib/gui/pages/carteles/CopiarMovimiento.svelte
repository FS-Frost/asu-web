<script lang="ts">
    import { onMount } from "svelte";
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";

    const title: string = text.copiarMovimiento;

    let rawBaseLine = $state<string>(
        "Dialogue: 0,0:00:00.00,0:00:05.00,Default,,0,0,0,,{\\move(320,470,320,168,0,4963)}Urusai!"
    );

    let rawTargetLines = $state<string>("");
    let rawResultLines = $state<string>("");
    let rawBaseMove = $state<string>("");
    let errorMessage = $state<string>("");

    $effect(() => {
        processLines(rawBaseLine, rawTargetLines);
    });

    function processLines(rawBaseLine: string, rawTargetLines: string): void {
        rawBaseMove = "";
        rawResultLines = "";
        errorMessage = "";

        if (rawTargetLines.length == 0) {
            return;
        }

        const targetLines: string[] = rawTargetLines.split("\n");

        const baseLine = asu.parseLine(rawBaseLine);
        if (baseLine == null) {
            errorMessage = `Movimiento base, línea inválida: '${rawBaseLine}'`;
            return;
        }

        const baseItems = asu.parseContent(baseLine.content);
        const baseMove = asu.findMove(baseItems);
        if (baseMove == null) {
            errorMessage = `Movimiento base, \\move no encontrado: '${rawBaseLine}'`;
            return;
        }

        rawBaseMove = asu.contentEffectToString({
            name: "effect",
            tags: [baseMove],
        });

        const deltaX = baseMove.x2 - baseMove.x1;
        const deltaY = baseMove.y2 - baseMove.y1;
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

            const items = asu.parseContent(line.content);
            const pos = asu.findPos(items);
            if (pos == null) {
                errorMessage = `Subtítulos, línea ${i + 1}, \\pos no encontrado: '${rawLine}'`;
                break;
            }

            asu.removeTag(items, asu.TagName.pos);
            const x1 = pos.x;
            const y1 = pos.y;
            const x2 = pos.x + deltaX;
            const y2 = pos.y + deltaY;

            asu.setMove(items, x1, y1, x2, y2, baseMove.t1, baseMove.t2);
            line.content = asu.contentsToString(items);
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

    function showExample(): void {
        for (let i = 1; i <= 10; i++) {
            const x = 182 + i * 5;
            const y = 421 + i * 7;
            rawTargetLines += `Dialogue: 0,0:00:00.00,0:00:05.00,Default,,0,0,0,,{\\pos(${x},${y})}LINEA ${i}\n`;
        }
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
        <div class="mt-2 mb-2 has-text-danger">
            {errorMessage}
        </div>
    {/if}

    <div class="field">
        <label class="label" for="">Movimiento base</label>
        <div class="control">
            <input
                bind:value={rawBaseLine}
                class="input {rawBaseMove == '' ? 'is-danger' : ''}"
                type="text"
                placeholder="\move(10,20,30,40)"
            />
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
</style>
