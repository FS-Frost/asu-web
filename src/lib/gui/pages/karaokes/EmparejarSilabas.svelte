<script lang="ts">
    import { onMount } from "svelte";
    import * as asu from "@fs-frost/asu";
    import text from "$lib/text";

    const title: string = text.emparejarSilabas;

    let errorMessage = $state<string>("");
    let placeholder = $state<string>("");
    let rawTargetLines = $state<string>("");
    let rawResultLines = $state<string>("");

    type KaraokeTag =
        | asu.TagKLowerCase
        | asu.TagKUpperCase
        | asu.TagKf
        | asu.TagKo;

    function isKaraokeTag(tag: asu.Tags): boolean {
        const karaokeTagNames: asu.TagName[] = [
            asu.TagName.kLowerCase,
            asu.TagName.kUpperCase,
            asu.TagName.kf,
            asu.TagName.ko,
        ];

        return karaokeTagNames.includes(tag.name);
    }

    function indexOfKaraokeTag(tags: asu.Tags[]): number {
        return tags.findIndex(isKaraokeTag);
    }

    function processLines(): void {
        errorMessage = "";
        rawResultLines = "";

        if (rawTargetLines.length == 0) {
            return;
        }

        const targetLines: string[] = rawTargetLines.split("\n");
        let result = "";

        for (let lineIndex = 0; lineIndex < targetLines.length; lineIndex++) {
            const rawLine = targetLines[lineIndex];
            if (rawLine.length == 0) {
                continue;
            }

            const line = asu.parseLine(rawLine);
            if (line == null) {
                errorMessage = `Subtítulos, línea ${lineIndex + 1} inválida: '${rawLine}'`;
                break;
            }

            const items = asu.parseContent(line.content);
            let newItems: asu.ContentItem[] = [];
            let karaokeCounter = 0;
            for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                const item = items[itemIndex];
                newItems.push(item);

                if (item.name === "text") {
                    const trimmedValue = item.value.trim();
                    if (trimmedValue === "" && karaokeCounter % 2 !== 0) {
                        newItems.splice(newItems.length - 1, 0, {
                            name: "effect",
                            tags: [
                                {
                                    name: asu.TagName.kLowerCase,
                                    value: 0,
                                },
                            ],
                        });
                    }

                    if (trimmedValue !== "" && karaokeCounter % 2 === 0) {
                        const lastItem = newItems.pop();
                        const secondToLastItem = newItems.pop();

                        if (secondToLastItem != null) {
                            if (secondToLastItem.name === "effect") {
                                const karaokeIndex = indexOfKaraokeTag(
                                    secondToLastItem.tags,
                                );

                                if (karaokeIndex >= 0) {
                                    const karaokeTag = secondToLastItem.tags[
                                        karaokeIndex
                                    ] as unknown as KaraokeTag;

                                    karaokeTag.value--;

                                    newItems.splice(
                                        newItems.length - karaokeCounter + 2,
                                        0,
                                        {
                                            name: "effect",
                                            tags: [
                                                {
                                                    name: asu.TagName
                                                        .kLowerCase,
                                                    value: 1,
                                                },
                                            ],
                                        },
                                    );
                                }
                            }

                            newItems.push(secondToLastItem);
                        }

                        if (lastItem != null) {
                            newItems.push(lastItem);
                        }
                    }

                    karaokeCounter = 0;
                    continue;
                }

                const indexKaraokeTag = indexOfKaraokeTag(item.tags);
                if (indexKaraokeTag >= 0) {
                    karaokeCounter++;
                }
            }

            line.content = asu.contentsToString(newItems);
            const rawResult = asu.lineToString(line);

            if (lineIndex > 0) {
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
        // placeholder += `Comment: 0,0:22:15.70,0:22:21.15,Romaji,,0,0,0,karaoke,{\\k38}na{\\k36}ri{\\k32}ta{\\k17}i {\\k21}ji{\\k37}bu{\\k19}n {\\k36}de{\\k45} {\\k43}na{\\k35}re{\\k34}na{\\k35}i {\\k37}ki{\\k19}no{\\k34}u {\\k27}ni`;

        placeholder += `Comment: 0,0:22:54.98,0:22:59.90,Romaji,,0,0,0,karaoke,{\\k37}ne{\\k36}ga{\\k53}i{\\k19}{\\k24}bo{\\k43}shi {\\k40}ni {\\k36}na{\\k35}ru {\\k35}yo {\\k55}ki{\\k18}ra{\\k61}ri☆`;

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
