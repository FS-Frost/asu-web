<script lang="ts">
    import { onMount } from "svelte";
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";

    const title: string = text.aplicarTraslacion;

    let offsetX1 = $state<number>(0);
    let offsetY1 = $state<number>(0);
    let offsetX2 = $state<number>(0);
    let offsetY2 = $state<number>(0);
    let rawTargetLines = $state<string>("");
    let rawResultLines = $state<string>("");
    let errorMessage = $state<string>("");

    $effect(() => {
        processLines(offsetX1, offsetY1, offsetX2, offsetY2, rawTargetLines);
    });

    function processLines(
        offsetX1: number,
        offsetY1: number,
        offsetX2: number,
        offsetY2: number,
        rawTargetLines: string
    ): void {
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
                console.error(`line ${i + 1}: invalid line`);
                break;
            }

            const items = asu.parseContent(line.content);

            const pos = asu.findPos(items);
            if (pos != null) {
                asu.removeTag(items, asu.TagName.pos);
                const x = pos.x + offsetX1;
                const y = pos.y + offsetY1;
                asu.setPos(items, x, y);
            }

            const move = asu.findMove(items);
            if (move != null) {
                asu.removeTag(items, asu.TagName.move);
                const x1 = move.x1 + offsetX1;
                const y1 = move.y1 + offsetY1;
                const x2 = move.x2 + offsetX2;
                const y2 = move.y2 + offsetY2;
                asu.setMove(items, x1, y1, x2, y2, move.t1, move.t2);
            }

            if (pos == null && move == null) {
                errorMessage = `Subtítulos, línea ${i + 1}, no se encontró \\pos ni \\move`;
                return;
            }

            const newContent = asu.contentsToString(items);
            line.content = newContent;
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
        offsetX1 = -10;
        offsetY1 = 20;

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
        <div class="mt-2 mb-2 has-text-danger">{errorMessage}</div>
    {/if}

    <div class="field">
        <label class="label" for="">
            Traslación de ({`${offsetX1 ?? 0},${offsetY1 ?? 0},${offsetX2 ?? 0},${offsetY2 ?? 0}`})
        </label>

        <div class="input-groups">
            <div class="inputs">
                <p class="control has-icons-left">
                    <span class="icon is-small is-left has-text-black">
                        X1:
                    </span>
                    <input bind:value={offsetX1} class="input" type="number" />
                </p>

                <p class="control has-icons-left">
                    <span class="icon is-small is-left has-text-black">
                        Y1:
                    </span>
                    <input bind:value={offsetY1} class="input" type="number" />
                </p>
            </div>

            <div class="inputs">
                <p class="control has-icons-left">
                    <span class="icon is-small is-left has-text-black">
                        X2:
                    </span>
                    <input bind:value={offsetX2} class="input" type="number" />
                </p>

                <p class="control has-icons-left">
                    <span class="icon is-small is-left has-text-black">
                        Y2:
                    </span>
                    <input bind:value={offsetY2} class="input" type="number" />
                </p>
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

    .input-groups {
        display: grid;
        grid-template-rows: auto auto;
        gap: 0.5rem;
    }

    .inputs {
        display: grid;
        grid-template-columns: auto auto;
        gap: 1rem;
    }
</style>
