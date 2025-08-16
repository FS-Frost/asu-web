<script lang="ts">
    import { onMount } from "svelte";
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";

    type Syl = {
        index: number;
        text: string;
        centiseconds: number | null;
    };

    const title: string = text.dividirKaraoke;

    const placeholderKaraoke: string =
        "Comment: 0,0:15:11.75,0:15:23.36,Romaji I,,0,0,0,karaoke,{\\k25}de{\\k19}ki{\\k20}te {\\k19}i{\\k37}na{\\k22}i{\\k20}n {\\k19}da{\\k19}ka{\\k28}ra{\\k31} {\\k29}ya{\\k28}sa{\\k37}shi{\\k40}ku {\\k40}o{\\k15}ko{\\k24}shi{\\k18}te {\\k275}ho{\\k29}{\\k88}shi{\\k279}i";

    let rawKaraoke = $state<string>(placeholderKaraoke);
    let previews = $state<string[]>([]);
    let rawResultLines = $state<string>("");
    let syls = $state<Syl[]>([]);
    let splitSylIndex = $state<number>(0);
    let errorMessage = $state<string>("");

    function processLines(): void {
        $inspect(syls);
        const line = asu.parseLine(rawKaraoke);
        if (line == null) {
            return;
        }

        const items = asu.parseContent(line.content);
        asu.mergeNeighboringEffects(items);
        const indexStart = 0;
        let indexEnd = syls[splitSylIndex].index + 1;

        let centisecondsFirstLine = 0;
        for (let i = 0; i <= splitSylIndex; i++) {
            const syl = syls[i];
            if (syl.centiseconds == null) {
                continue;
            }

            centisecondsFirstLine += syl.centiseconds;
        }

        const originalStartInSeconds = asu.timeToSeconds(line.start);
        const originalEndInSeconds = asu.timeToSeconds(line.end);

        const itemsLine1 = items.slice(indexStart, indexEnd);
        line.content = asu.contentsToString(itemsLine1);

        const secondsLine1 = centisecondsFirstLine / 100;
        line.end = asu.secondsToTime(originalStartInSeconds + secondsLine1);
        rawResultLines = asu.lineToString(line);

        let startLine2NeedsUpdate = true;
        let startLine2SkipCount = 0;
        while (startLine2NeedsUpdate) {
            const firstItemLine2 = items[indexEnd + 1];
            if (firstItemLine2?.name != "text") {
                startLine2NeedsUpdate = false;
                break;
            }

            startLine2NeedsUpdate =
                firstItemLine2.value.replaceAll(" ", "").length === 0;

            if (startLine2NeedsUpdate) {
                indexEnd += 2;
                startLine2SkipCount++;
            }

            if (startLine2SkipCount > syls.length) {
                break;
            }
        }

        let centisecondsSecondLine = 0;
        for (
            let i = splitSylIndex + 1 + startLine2SkipCount;
            i < syls.length;
            i++
        ) {
            const syl = syls[i];
            $inspect(syl);
            if (syl?.centiseconds == null) {
                continue;
            }

            centisecondsSecondLine += syl.centiseconds;
        }

        console.log({ centisecondsSecondLine });

        const itemsLine2 = items.slice(indexEnd);
        line.end = asu.secondsToTime(originalEndInSeconds);
        line.start = asu.secondsToTime(
            originalEndInSeconds - centisecondsSecondLine / 100,
        );

        line.content = asu.contentsToString(itemsLine2);
        rawResultLines += "\n" + asu.lineToString(line);

        previews = [
            asu.contentsToString(itemsLine1.filter((x) => x.name == "text")),
            asu.contentsToString(itemsLine2.filter((x) => x.name == "text")),
        ];
    }

    async function copyResult(): Promise<void> {
        await navigator.clipboard.writeText(rawResultLines);
        alert("¡Líneas copiadas al portapapeles!");
    }

    function parseKaraoke(): Syl[] {
        previews = [];
        rawResultLines = "";
        syls = [];
        splitSylIndex = 0;
        errorMessage = "";

        const line = asu.parseLine(rawKaraoke);
        if (line == null) {
            errorMessage = `Línea de karaoke inválida. Se esperaba el formato: <${placeholderKaraoke}>.`;
            return [];
        }

        const items = asu.parseContent(line.content);
        asu.mergeNeighboringEffects(items);
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.name != "text") {
                continue;
            }

            syls.push({
                index: i,
                text: item.value.replaceAll(" ", ""),
                centiseconds: null,
            });

            const previousIndex = i - 1;
            if (previousIndex < 0) {
                continue;
            }

            const previousItem = items[previousIndex];
            if (previousItem.name != "effect") {
                continue;
            }

            const tagK = previousItem.tags.find(
                (x) =>
                    x.name === asu.TagName.kLowerCase ||
                    x.name === asu.TagName.kUpperCase ||
                    x.name === asu.TagName.kf ||
                    x.name === asu.TagName.ko,
            );

            if (tagK == null) {
                continue;
            }

            const isSomeTagK =
                tagK.name === asu.TagName.kLowerCase ||
                tagK.name === asu.TagName.kUpperCase ||
                tagK.name === asu.TagName.kf ||
                tagK.name === asu.TagName.ko;

            if (!isSomeTagK) {
                continue;
            }

            syls[syls.length - 1].centiseconds = tagK.value;
            continue;
        }

        splitSylIndex = Math.floor(syls.length / 2);
        splitSylIndex = 9;
        processLines();
        return syls;
    }

    onMount(() => {
        parseKaraoke();
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section>
    <h1>{title}</h1>

    <div class="field">
        <label class="label" for="">Karaoke</label>
        <div class="control">
            <input
                bind:value={rawKaraoke}
                class="input"
                type="text"
                placeholder={placeholderKaraoke}
                oninput={parseKaraoke}
            />
        </div>
    </div>

    {#if errorMessage != ""}
        <p class="error">{errorMessage}</p>
    {/if}

    <div class="mb-2">
        <label class="label mt-2" for=""> Sílaba divisoria </label>
        <div class="buttons">
            {#each syls as syl, index}
                {#if syl.text.replaceAll(" ", "").length > 0}
                    <button
                        class="button {index === splitSylIndex
                            ? 'is-link'
                            : ''}"
                        title={`${syl.text}: ${syl.centiseconds} centésimas`}
                        onclick={() => {
                            splitSylIndex = index;
                            processLines();
                        }}
                    >
                        {syl.text}
                    </button>
                {/if}
            {/each}
        </div>
    </div>

    <div class="field">
        <label class="label" for="">Vista previa</label>

        {#each previews as preview, i}
            <p class="preview">Línea {i + 1}: <b>{preview}</b></p>
        {/each}
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

    .error {
        color: red;
        font-weight: bold;
    }
</style>
