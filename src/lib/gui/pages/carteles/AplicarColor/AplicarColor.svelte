<script lang="ts">
    import { onMount, tick } from "svelte";
    import * as asu from "@fs-frost/asu";
    import InputBox from "./InputBox.svelte";
    import { interpolateColors } from "$lib/carteles";
    import ButtonCopyResult from "$lib/gui/ButtonCopyResult.svelte";
    import text from "$lib/text";

    const title: string = text.aplicarColor;
    const startPlaceholder: string = "&HFFFFFF&";
    const endPlaceholder: string = "&H000000&";

    let errorMessage = $state<string>("");
    let errorMessageElement = $state<HTMLElement>();
    let rawTargetLines = $state<string>("");
    let rawResultLines = $state<string>("");
    let colorTotalStart = $state<string>(startPlaceholder);
    let colorTotalEnd = $state<string>(endPlaceholder);
    let color1Start = $state<string>(startPlaceholder);
    let color1End = $state<string>(endPlaceholder);
    let color2Start = $state<string>(startPlaceholder);
    let color2End = $state<string>(endPlaceholder);
    let color3Start = $state<string>(startPlaceholder);
    let color3End = $state<string>(endPlaceholder);
    let color4Start = $state<string>(startPlaceholder);
    let color4End = $state<string>(endPlaceholder);

    let colorTotalDisabled = $state<boolean>(false);
    let color1Disabled = $state<boolean>(true);
    let color2Disabled = $state<boolean>(true);
    let color3Disabled = $state<boolean>(true);
    let color4Disabled = $state<boolean>(true);

    let inputBoxColorTotal = $state<InputBox>();
    let inputBoxColor1 = $state<InputBox>();
    let inputBoxColor2 = $state<InputBox>();
    let inputBoxColor3 = $state<InputBox>();
    let inputBoxColor4 = $state<InputBox>();

    let reverseLinesEnabled = $state<boolean>(false);

    function handleColorTotalEnabled(): void {
        inputBoxColor1?.disable();
        inputBoxColor2?.disable();
        inputBoxColor3?.disable();
        inputBoxColor4?.disable();
    }

    function handleColorTotalDisabled(): void {
        if (
            color1Disabled &&
            color2Disabled &&
            color3Disabled &&
            color4Disabled
        ) {
            inputBoxColor1?.enable();
            inputBoxColor2?.disable();
            inputBoxColor3?.disable();
            inputBoxColor4?.disable();
        }
    }

    function handleColorChannelEnabled(): void {
        inputBoxColorTotal?.disable();
    }

    function handleColorChannelDisabled(): void {
        if (
            color1Disabled &&
            color2Disabled &&
            color3Disabled &&
            color4Disabled
        ) {
            inputBoxColorTotal?.enable();
        }
    }

    async function processLines(): Promise<void> {
        try {
            rawResultLines = "";
            errorMessage = "";

            const lines: asu.Line[] = [];
            const rawLines = rawTargetLines.split("\n");
            for (const rawLine of rawLines) {
                if (rawLine.length == 0) {
                    continue;
                }

                const line = asu.parseLine(rawLine);
                if (line != null) {
                    lines.push(line);
                }
            }

            if (!colorTotalDisabled) {
                const colorBGRStart = asu.parseColorBGR(colorTotalStart);
                if (colorBGRStart == null) {
                    errorMessage = `Color total de inicio inválido: ${colorTotalStart}`;
                    return;
                }

                const colorBGREnd = asu.parseColorBGR(colorTotalEnd);
                if (colorBGREnd == null) {
                    errorMessage = `Color total de fin inválido: ${colorTotalEnd}`;
                    return;
                }

                const interpolatedColors = interpolateColors(
                    colorBGRStart,
                    colorBGREnd,
                    lines.length
                );

                if (reverseLinesEnabled) {
                    interpolatedColors.reverse();
                }

                let result = "";
                for (let i = 0; i < lines.length; i++) {
                    const color = interpolatedColors[i];
                    const items = asu.parseContent(lines[i].content);
                    asu.setColor(items, color.blue, color.green, color.red);
                    lines[i].content = asu.contentsToString(items);
                    const rawResult = asu.lineToString(lines[i]);

                    if (i > 0) {
                        result += "\n";
                    }

                    result += rawResult;
                }

                rawResultLines = result;
                return;
            }

            if (!color1Disabled) {
                const colorBGRStart = asu.parseColorBGR(color1Start);
                if (colorBGRStart == null) {
                    errorMessage = `Color 1 de inicio inválido: ${color1Start}`;
                    return;
                }

                const colorBGREnd = asu.parseColorBGR(color1End);
                if (colorBGREnd == null) {
                    errorMessage = `Color 1 de fin inválido: ${color1End}`;
                    return;
                }

                const interpolatedColors = interpolateColors(
                    colorBGRStart,
                    colorBGREnd,
                    lines.length
                );

                if (reverseLinesEnabled) {
                    interpolatedColors.reverse();
                }

                let result = "";
                for (let i = 0; i < lines.length; i++) {
                    const color = interpolatedColors[i];
                    const items = asu.parseContent(lines[i].content);
                    asu.setColor1(items, color.blue, color.green, color.red);
                    lines[i].content = asu.contentsToString(items);
                    const rawResult = asu.lineToString(lines[i]);

                    if (i > 0) {
                        result += "\n";
                    }

                    result += rawResult;
                }

                rawResultLines = result;
            }

            if (!color2Disabled) {
                const colorBGRStart = asu.parseColorBGR(color2Start);
                if (colorBGRStart == null) {
                    errorMessage = `Color 2 de inicio inválido: ${color2Start}`;
                    return;
                }

                const colorBGREnd = asu.parseColorBGR(color2End);
                if (colorBGREnd == null) {
                    errorMessage = `Color 2 de fin inválido: ${color2End}`;
                    return;
                }

                const interpolatedColors = interpolateColors(
                    colorBGRStart,
                    colorBGREnd,
                    lines.length
                );

                if (reverseLinesEnabled) {
                    interpolatedColors.reverse();
                }

                let result = "";
                for (let i = 0; i < lines.length; i++) {
                    const color = interpolatedColors[i];
                    const items = asu.parseContent(lines[i].content);
                    asu.setColor2(items, color.blue, color.green, color.red);
                    lines[i].content = asu.contentsToString(items);
                    const rawResult = asu.lineToString(lines[i]);

                    if (i > 0) {
                        result += "\n";
                    }

                    result += rawResult;
                }

                rawResultLines = result;
            }

            if (!color3Disabled) {
                const colorBGRStart = asu.parseColorBGR(color3Start);
                if (colorBGRStart == null) {
                    errorMessage = `Color 3 de inicio inválido: ${color3Start}`;
                    return;
                }

                const colorBGREnd = asu.parseColorBGR(color3End);
                if (colorBGREnd == null) {
                    errorMessage = `Color 3 de fin inválido: ${color3End}`;
                    return;
                }

                const interpolatedColors = interpolateColors(
                    colorBGRStart,
                    colorBGREnd,
                    lines.length
                );

                if (reverseLinesEnabled) {
                    interpolatedColors.reverse();
                }

                let result = "";
                for (let i = 0; i < lines.length; i++) {
                    const color = interpolatedColors[i];
                    const items = asu.parseContent(lines[i].content);
                    asu.setColor3(items, color.blue, color.green, color.red);
                    lines[i].content = asu.contentsToString(items);
                    const rawResult = asu.lineToString(lines[i]);

                    if (i > 0) {
                        result += "\n";
                    }

                    result += rawResult;
                }

                rawResultLines = result;
            }

            if (!color4Disabled) {
                const colorBGRStart = asu.parseColorBGR(color4Start);
                if (colorBGRStart == null) {
                    errorMessage = `Color 4 de inicio inválido: ${color4Start}`;
                    return;
                }

                const colorBGREnd = asu.parseColorBGR(color4End);
                if (colorBGREnd == null) {
                    errorMessage = `Color 4 de fin inválido: ${color4End}`;
                    return;
                }

                const interpolatedColors = interpolateColors(
                    colorBGRStart,
                    colorBGREnd,
                    lines.length
                );

                if (reverseLinesEnabled) {
                    interpolatedColors.reverse();
                }

                let result = "";
                for (let i = 0; i < lines.length; i++) {
                    const color = interpolatedColors[i];
                    const items = asu.parseContent(lines[i].content);
                    asu.setColor4(items, color.blue, color.green, color.red);
                    lines[i].content = asu.contentsToString(items);
                    const rawResult = asu.lineToString(lines[i]);

                    if (i > 0) {
                        result += "\n";
                    }

                    result += rawResult;
                }

                rawResultLines = result;
            }
        } catch (error) {
            console.error("error al procesar líneas", error);
        } finally {
            await tick();
            errorMessageElement?.scrollIntoView({
                behavior: "smooth",
            });
        }
    }

    onMount(() => {
        rawTargetLines += `Dialogue: 0,0:00:00.00,0:00:00.02,Default,,0,0,0,,{\\fs42\\bord3\\shad0}TEXTO\n`;
        rawTargetLines += `Dialogue: 0,0:00:00.02,0:00:00.06,Default,,0,0,0,,{\\fs42\\bord3\\shad0}TEXTO\n`;
        rawTargetLines += `Dialogue: 0,0:00:00.06,0:00:00.10,Default,,0,0,0,,{\\fs42\\bord3\\shad0}TEXTO\n`;
        rawTargetLines += `Dialogue: 0,0:00:00.10,0:00:00.14,Default,,0,0,0,,{\\fs42\\bord3\\shad0}TEXTO\n`;
        rawTargetLines += `Dialogue: 0,0:00:00.14,0:00:00.18,Default,,0,0,0,,{\\fs42\\bord3\\shad0}TEXTO\n`;
        rawTargetLines += `Dialogue: 0,0:00:00.18,0:00:00.23,Default,,0,0,0,,{\\fs42\\bord3\\shad0}TEXTO\n`;
        rawTargetLines += `Dialogue: 0,0:00:00.23,0:00:00.27,Default,,0,0,0,,{\\fs42\\bord3\\shad0}TEXTO\n`;
        rawTargetLines += `Dialogue: 0,0:00:00.27,0:00:00.31,Default,,0,0,0,,{\\fs42\\bord3\\shad0}TEXTO\n`;
        rawTargetLines += `Dialogue: 0,0:00:00.31,0:00:00.35,Default,,0,0,0,,{\\fs42\\bord3\\shad0}TEXTO`;
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section>
    <h1>{title}</h1>

    {#if errorMessage != ""}
        <div bind:this={errorMessageElement} class="mt-2 mb-2 has-text-danger">
            {errorMessage}
        </div>
    {/if}

    <label class="label" for="">Configuración de color</label>

    <InputBox
        label="Color total"
        bind:this={inputBoxColorTotal}
        bind:startValue={colorTotalStart}
        bind:endValue={colorTotalEnd}
        bind:disabled={colorTotalDisabled}
        {startPlaceholder}
        {endPlaceholder}
        onEnabled={() => handleColorTotalEnabled()}
        onDisabled={() => handleColorTotalDisabled()}
    />

    <InputBox
        label="Color 1"
        bind:this={inputBoxColor1}
        bind:startValue={color1Start}
        bind:endValue={color1End}
        bind:disabled={color1Disabled}
        {startPlaceholder}
        {endPlaceholder}
        onEnabled={() => handleColorChannelEnabled()}
        onDisabled={() => handleColorChannelDisabled()}
    />

    <InputBox
        label="Color 2"
        bind:this={inputBoxColor2}
        bind:startValue={color2Start}
        bind:endValue={color2End}
        bind:disabled={color2Disabled}
        {startPlaceholder}
        {endPlaceholder}
        onEnabled={() => handleColorChannelEnabled()}
        onDisabled={() => handleColorChannelDisabled()}
    />

    <InputBox
        label="Color 3"
        bind:this={inputBoxColor3}
        bind:startValue={color3Start}
        bind:endValue={color3End}
        bind:disabled={color3Disabled}
        {startPlaceholder}
        {endPlaceholder}
        onEnabled={() => handleColorChannelEnabled()}
        onDisabled={() => handleColorChannelDisabled()}
    />

    <InputBox
        label="Color 4"
        bind:this={inputBoxColor4}
        bind:startValue={color4Start}
        bind:endValue={color4End}
        bind:disabled={color4Disabled}
        {startPlaceholder}
        {endPlaceholder}
        onEnabled={() => handleColorChannelEnabled()}
        onDisabled={() => handleColorChannelDisabled()}
    />

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

    <button class="button is-link is-fullwidth" onclick={() => processLines()}>
        {text.aplicarColor}
    </button>

    <div class="field mt-2">
        <label class="label" for="">
            {text.resultado}
            <ButtonCopyResult {rawResultLines} />
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
