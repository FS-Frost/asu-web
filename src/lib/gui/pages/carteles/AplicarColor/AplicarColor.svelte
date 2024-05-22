<script lang="ts">
    import { onMount } from "svelte";
    import * as asu from "@fs-frost/asu";
    import InputBox from "./InputBox.svelte";
    import { generateHexArray, interpolateColors } from "$lib/carteles";
    import ButtonCopyResult from "$lib/gui/ButtonCopyResult.svelte";
    import text from "$lib/text";

    const title: string = text.aplicarColor;
    const startPlaceholder: string = "&HFFFFFF&";
    const endPlaceholder: string = "&H000000&";

    let rawTargetLines: string = "";
    let rawResultLines: string = "";
    let colorTotalStart: string = startPlaceholder;
    let colorTotalEnd: string = endPlaceholder;
    let color1Start: string = startPlaceholder;
    let color1End: string = endPlaceholder;
    let color2Start: string = startPlaceholder;
    let color2End: string = endPlaceholder;
    let color3Start: string = startPlaceholder;
    let color3End: string = endPlaceholder;
    let color4Start: string = startPlaceholder;
    let color4End: string = endPlaceholder;

    let colorTotalDisabled: boolean = false;
    let color1Disabled: boolean = true;
    let color2Disabled: boolean = true;
    let color3Disabled: boolean = true;
    let color4Disabled: boolean = true;

    let inputBoxColorTotal: InputBox;
    let inputBoxColor1: InputBox;
    let inputBoxColor2: InputBox;
    let inputBoxColor3: InputBox;
    let inputBoxColor4: InputBox;

    let reverseLinesEnabled: boolean = false;

    function handleColorTotalEnabled(): void {
        inputBoxColor1.disable();
        inputBoxColor2.disable();
        inputBoxColor3.disable();
        inputBoxColor4.disable();
    }

    function handleColorTotalDisabled(): void {
        if (
            color1Disabled &&
            color2Disabled &&
            color3Disabled &&
            color4Disabled
        ) {
            inputBoxColor1.enable();
            inputBoxColor2.disable();
            inputBoxColor3.disable();
            inputBoxColor4.disable();
        }
    }

    function handleColorChannelEnabled(): void {
        inputBoxColorTotal.disable();
    }

    function handleColorChannelDisabled(): void {
        if (
            color1Disabled &&
            color2Disabled &&
            color3Disabled &&
            color4Disabled
        ) {
            inputBoxColorTotal.enable();
        }
    }

    function processLines(): void {
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
                alert(`Color total de inicio inválido: ${colorTotalStart}`);
                return;
            }

            const colorBGREnd = asu.parseColorBGR(colorTotalEnd);
            if (colorBGREnd == null) {
                alert(`Color total de fin inválido: ${colorTotalEnd}`);
                return;
            }

            const interpolatedColors = interpolateColors(
                colorBGRStart,
                colorBGREnd,
                lines.length,
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
                alert(`Color 1 de inicio inválido: ${color1Start}`);
                return;
            }

            const colorBGREnd = asu.parseColorBGR(color1End);
            if (colorBGREnd == null) {
                alert(`Color 1 de fin inválido: ${color1End}`);
                return;
            }

            const interpolatedColors = interpolateColors(
                colorBGRStart,
                colorBGREnd,
                lines.length,
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
                alert(`Color 2 de inicio inválido: ${color2Start}`);
                return;
            }

            const colorBGREnd = asu.parseColorBGR(color2End);
            if (colorBGREnd == null) {
                alert(`Color 2 de fin inválido: ${color2End}`);
                return;
            }

            const interpolatedColors = interpolateColors(
                colorBGRStart,
                colorBGREnd,
                lines.length,
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
                alert(`Color 3 de inicio inválido: ${color3Start}`);
                return;
            }

            const colorBGREnd = asu.parseColorBGR(color3End);
            if (colorBGREnd == null) {
                alert(`Color 3 de fin inválido: ${color3End}`);
                return;
            }

            const interpolatedColors = interpolateColors(
                colorBGRStart,
                colorBGREnd,
                lines.length,
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
                alert(`Color 4 de inicio inválido: ${color4Start}`);
                return;
            }

            const colorBGREnd = asu.parseColorBGR(color4End);
            if (colorBGREnd == null) {
                alert(`Color 4 de fin inválido: ${color4End}`);
                return;
            }

            const interpolatedColors = interpolateColors(
                colorBGRStart,
                colorBGREnd,
                lines.length,
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
    <h1 class="title is-5">{title}</h1>

    <label class="label" for="">Configuración de color</label>

    <InputBox
        label="Color total"
        bind:this={inputBoxColorTotal}
        bind:startValue={colorTotalStart}
        bind:endValue={colorTotalEnd}
        bind:disabled={colorTotalDisabled}
        {startPlaceholder}
        {endPlaceholder}
        on:enabled={() => handleColorTotalEnabled()}
        on:disabled={() => handleColorTotalDisabled()}
    />

    <InputBox
        label="Color 1"
        bind:this={inputBoxColor1}
        bind:startValue={color1Start}
        bind:endValue={color1End}
        bind:disabled={color1Disabled}
        {startPlaceholder}
        {endPlaceholder}
        on:enabled={() => handleColorChannelEnabled()}
        on:disabled={() => handleColorChannelDisabled()}
    />

    <InputBox
        label="Color 2"
        bind:this={inputBoxColor2}
        bind:startValue={color2Start}
        bind:endValue={color2End}
        bind:disabled={color2Disabled}
        {startPlaceholder}
        {endPlaceholder}
        on:enabled={() => handleColorChannelEnabled()}
        on:disabled={() => handleColorChannelDisabled()}
    />

    <InputBox
        label="Color 3"
        bind:this={inputBoxColor3}
        bind:startValue={color3Start}
        bind:endValue={color3End}
        bind:disabled={color3Disabled}
        {startPlaceholder}
        {endPlaceholder}
        on:enabled={() => handleColorChannelEnabled()}
        on:disabled={() => handleColorChannelDisabled()}
    />

    <InputBox
        label="Color 4"
        bind:this={inputBoxColor4}
        bind:startValue={color4Start}
        bind:endValue={color4End}
        bind:disabled={color4Disabled}
        {startPlaceholder}
        {endPlaceholder}
        on:enabled={() => handleColorChannelEnabled()}
        on:disabled={() => handleColorChannelDisabled()}
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

    <button class="button is-link is-fullwidth" on:click={() => processLines()}>
        {text.aplicarColor}
    </button>

    <div class="field mt-2">
        <label class="label" for="">
            {text.resultado}
            <ButtonCopyResult {rawResultLines} />
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

    .reverse {
        margin-left: 0.5rem;
    }
</style>
