<script lang="ts">
    import { onMount } from "svelte";
    import * as asu from "$lib/asu/asu.browser";

    const title: string = "Copiar movimiento";

    let rawBaseLine: string =
        "Dialogue: 0,0:00:00.00,0:00:05.00,Default,,0,0,0,,{\\move(320,470,320,168,0,4963)}Urusai!";
    let rawTargetLines: string = "";
    let rawResultLines: string = "";

    function processLines(): void {
        if (rawTargetLines.length == 0) {
            alert("Pega las líneas desde Aegisub para continuar.");
            return;
        }

        const targetLines: string[] = rawTargetLines.split("\n");
        console.log(targetLines);

        const baseLine = asu.parseLine(rawBaseLine);
        if (baseLine == null) {
            console.error("invalid base line", rawBaseLine);
            return;
        }

        const baseItems = asu.parseContent(baseLine.content);
        const baseMove = asu.findMove(baseItems);
        if (baseMove == null) {
            console.error("base move not found");
            return;
        }

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
                console.error(`line ${i + 1}: invalid line`);
                break;
            }

            const items = asu.parseContent(line.content);
            const pos = asu.findPos(items);
            if (pos == null) {
                console.error(`line ${i + 1}: pos not found`);
                break;
            }

            asu.removeTag(items, asu.TagName.pos);
            const x1 = pos.x;
            const y1 = pos.y;
            const x2 = pos.x + deltaX;
            const y2 = pos.y + deltaY;
            asu.setMove(items, x1, y1, x2, y2, baseMove.t1, baseMove.t2);
            const newContent = asu.contentsToString(items);
            line.content = newContent;
            const rawResult = asu.lineToString(line);
            console.log(rawResult);

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
        for (let i = 1; i <= 10; i++) {
            const x = 182 + i * 5;
            const y = 421 + i * 7;
            rawTargetLines += `Dialogue: 0,0:00:00.00,0:00:05.00,Default,,0,0,0,,{\\pos(${x},${y})}LINEA ${i}\n`;
        }
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section>
    <h1 class="title is-5">{title}</h1>

    <div class="field">
        <label class="label" for="">Movimiento base</label>
        <div class="control">
            <input
                bind:value={rawBaseLine}
                class="input"
                type="text"
                placeholder="\move(10,20,30,40)"
            />
        </div>
    </div>

    <div class="field">
        <label class="label" for="">Subtítulos</label>
        <div class="control">
            <textarea
                bind:value={rawTargetLines}
                class="textarea"
                placeholder="Pega tus líneas aquí"
            ></textarea>
        </div>
    </div>

    <button class="button is-link is-fullwidth" on:click={() => processLines()}
        >Copiar movimiento</button
    >

    <div class="field mt-2">
        <label class="label" for="">
            Resultado
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
