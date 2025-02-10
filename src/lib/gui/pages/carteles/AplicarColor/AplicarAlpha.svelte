<script lang="ts">
    import { onMount } from "svelte";
    import * as asu from "@fs-frost/asu";
    import InputBox from "./InputBox.svelte";
    import { generateHexArray } from "$lib/carteles";
    import ButtonCopyResult from "$lib/gui/ButtonCopyResult.svelte";
    import text from "$lib/text";

    const title: string = text.aplicarAlpha;
    const startPlaceholder: string = "0";
    const endPlaceholder: string = "FF";

    let rawTargetLines = $state<string>("");
    let rawResultLines = $state<string>("");
    let alphaTotalStart = $state<string>("0");
    let alphaTotalEnd = $state<string>("FF");
    let alpha1Start = $state<string>("0");
    let alpha1End = $state<string>("FF");
    let alpha2Start = $state<string>("0");
    let alpha2End = $state<string>("FF");
    let alpha3Start = $state<string>("0");
    let alpha3End = $state<string>("FF");
    let alpha4Start = $state<string>("0");
    let alpha4End = $state<string>("FF");

    let alphaTotalDisabled = $state<boolean>(false);
    let alpha1Disabled = $state<boolean>(true);
    let alpha2Disabled = $state<boolean>(true);
    let alpha3Disabled = $state<boolean>(true);
    let alpha4Disabled = $state<boolean>(true);

    let inputBoxAlphaTotal = $state<InputBox>();
    let inputBoxAlpha1 = $state<InputBox>();
    let inputBoxAlpha2 = $state<InputBox>();
    let inputBoxAlpha3 = $state<InputBox>();
    let inputBoxAlpha4 = $state<InputBox>();

    let reverseLinesEnabled = $state<boolean>(false);

    function handleAlphaTotalEnabled(): void {
        inputBoxAlpha1?.disable();
        inputBoxAlpha2?.disable();
        inputBoxAlpha3?.disable();
        inputBoxAlpha4?.disable();
    }

    function handleAlphaTotalDisabled(): void {
        if (
            alpha1Disabled &&
            alpha2Disabled &&
            alpha3Disabled &&
            alpha4Disabled
        ) {
            inputBoxAlpha1?.enable();
            inputBoxAlpha2?.disable();
            inputBoxAlpha3?.disable();
            inputBoxAlpha4?.disable();
        }
    }

    function handleAlphaChannelEnabled(): void {
        inputBoxAlphaTotal?.disable();
    }

    function handleAlphaChannelDisabled(): void {
        if (
            alpha1Disabled &&
            alpha2Disabled &&
            alpha3Disabled &&
            alpha4Disabled
        ) {
            inputBoxAlphaTotal?.enable();
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

        if (!alphaTotalDisabled) {
            const startValue = asu.hexToNumber(alphaTotalStart);
            const endValue = asu.hexToNumber(alphaTotalEnd);

            if (startValue >= endValue) {
                alert("El inicio de alpha total debe ser menor al fin.");
                return;
            }

            if (startValue < 0) {
                alert(
                    "El inicio de alpha total debe ser mayor o igual a 00 (0).",
                );
                return;
            }

            if (endValue > 255) {
                alert(
                    "El fin de alpha total debe ser menor o igual a FF (255).",
                );
                return;
            }

            const alphaHexValues = generateHexArray(startValue, endValue);
            if (reverseLinesEnabled) {
                alphaHexValues.reverse();
            }

            let result = "";
            for (let i = 0; i < lines.length; i++) {
                let alphaIndex = Math.floor(
                    (alphaHexValues.length * i) / lines.length,
                );

                if (alphaIndex >= alphaHexValues.length) {
                    alphaIndex = alphaHexValues.length - 1;
                }

                const alphaValue = alphaHexValues[alphaIndex];
                const alphaArg = `&H${alphaValue}&`;
                const items = asu.parseContent(lines[i].content);
                asu.setAlpha(items, alphaArg);
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

        if (!alpha1Disabled) {
            const startValue = asu.hexToNumber(alpha1Start);
            const endValue = asu.hexToNumber(alpha1End);

            if (startValue >= endValue) {
                alert("El inicio de alpha 1 debe ser menor al fin.");
                return;
            }

            if (startValue < 0) {
                alert("El inicio de alpha 1 debe ser mayor o igual a 00 (0).");
                return;
            }

            if (endValue > 255) {
                alert("El fin de alpha 1 debe ser menor o igual a FF (255).");
                return;
            }

            const alphaHexValues = generateHexArray(startValue, endValue);
            if (reverseLinesEnabled) {
                alphaHexValues.reverse();
            }

            let result = "";
            for (let i = 0; i < lines.length; i++) {
                let alphaIndex = Math.floor(
                    (alphaHexValues.length * i) / lines.length,
                );

                if (alphaIndex >= alphaHexValues.length) {
                    alphaIndex = alphaHexValues.length - 1;
                }

                const alphaValue = alphaHexValues[alphaIndex];
                const alphaArg = `&H${alphaValue}&`;
                const items = asu.parseContent(lines[i].content);
                asu.setAlpha1(items, alphaArg);
                lines[i].content = asu.contentsToString(items);
                const rawResult = asu.lineToString(lines[i]);

                if (i > 0) {
                    result += "\n";
                }

                result += rawResult;
            }

            rawResultLines = result;
        }

        if (!alpha2Disabled) {
            const startValue = asu.hexToNumber(alpha2Start);
            const endValue = asu.hexToNumber(alpha2End);

            if (startValue >= endValue) {
                alert("El inicio de alpha 2 debe ser menor al fin.");
                return;
            }

            if (startValue < 0) {
                alert("El inicio de alpha 2 debe ser mayor o igual a 00 (0).");
                return;
            }

            if (endValue > 255) {
                alert("El fin de alpha 2 debe ser menor o igual a FF (255).");
                return;
            }

            const alphaHexValues = generateHexArray(startValue, endValue);
            if (reverseLinesEnabled) {
                alphaHexValues.reverse();
            }

            let result = "";
            for (let i = 0; i < lines.length; i++) {
                let alphaIndex = Math.floor(
                    (alphaHexValues.length * i) / lines.length,
                );

                if (alphaIndex >= alphaHexValues.length) {
                    alphaIndex = alphaHexValues.length - 1;
                }

                const alphaValue = alphaHexValues[alphaIndex];
                const alphaArg = `&H${alphaValue}&`;
                const items = asu.parseContent(lines[i].content);
                asu.setAlpha2(items, alphaArg);
                lines[i].content = asu.contentsToString(items);
                const rawResult = asu.lineToString(lines[i]);

                if (i > 0) {
                    result += "\n";
                }

                result += rawResult;
            }

            rawResultLines = result;
        }

        if (!alpha3Disabled) {
            const startValue = asu.hexToNumber(alpha3Start);
            const endValue = asu.hexToNumber(alpha3End);

            if (startValue >= endValue) {
                alert("El inicio de alpha 3 debe ser menor al fin.");
                return;
            }

            if (startValue < 0) {
                alert("El inicio de alpha 3 debe ser mayor o igual a 00 (0).");
                return;
            }

            if (endValue > 255) {
                alert("El fin de alpha 3 debe ser menor o igual a FF (255).");
                return;
            }

            const alphaHexValues = generateHexArray(startValue, endValue);
            if (reverseLinesEnabled) {
                alphaHexValues.reverse();
            }

            let result = "";
            for (let i = 0; i < lines.length; i++) {
                let alphaIndex = Math.floor(
                    (alphaHexValues.length * i) / lines.length,
                );

                if (alphaIndex >= alphaHexValues.length) {
                    alphaIndex = alphaHexValues.length - 1;
                }

                const alphaValue = alphaHexValues[alphaIndex];
                const alphaArg = `&H${alphaValue}&`;
                const items = asu.parseContent(lines[i].content);
                asu.setAlpha3(items, alphaArg);
                lines[i].content = asu.contentsToString(items);
                const rawResult = asu.lineToString(lines[i]);

                if (i > 0) {
                    result += "\n";
                }

                result += rawResult;
            }

            rawResultLines = result;
        }

        if (!alpha4Disabled) {
            const startValue = asu.hexToNumber(alpha4Start);
            const endValue = asu.hexToNumber(alpha4End);

            if (startValue >= endValue) {
                alert("El inicio de alpha 4 debe ser menor al fin.");
                return;
            }

            if (startValue < 0) {
                alert("El inicio de alpha 4 debe ser mayor o igual a 00 (0).");
                return;
            }

            if (endValue > 255) {
                alert("El fin de alpha 4 debe ser menor o igual a FF (255).");
                return;
            }

            const alphaHexValues = generateHexArray(startValue, endValue);
            if (reverseLinesEnabled) {
                alphaHexValues.reverse();
            }

            let result = "";
            for (let i = 0; i < lines.length; i++) {
                let alphaIndex = Math.floor(
                    (alphaHexValues.length * i) / lines.length,
                );

                if (alphaIndex >= alphaHexValues.length) {
                    alphaIndex = alphaHexValues.length - 1;
                }

                const alphaValue = alphaHexValues[alphaIndex];
                const alphaArg = `&H${alphaValue}&`;
                const items = asu.parseContent(lines[i].content);
                asu.setAlpha4(items, alphaArg);
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
        for (let i = 1; i <= 10; i++) {
            rawTargetLines += `Dialogue: 0,0:00:00.00,0:00:05.00,Default,,0,0,0,,{\\pos(182,421)}LINEA ${i}\n`;
        }
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section>
    <h1>{title}</h1>

    <label class="label" for="">Configuración alpha</label>

    <InputBox
        label="Alpha total"
        bind:this={inputBoxAlphaTotal}
        bind:startValue={alphaTotalStart}
        bind:endValue={alphaTotalEnd}
        bind:disabled={alphaTotalDisabled}
        {startPlaceholder}
        {endPlaceholder}
        onEnabled={() => handleAlphaTotalEnabled()}
        onDisabled={() => handleAlphaTotalDisabled()}
    />

    <InputBox
        label="Alpha 1"
        bind:this={inputBoxAlpha1}
        bind:startValue={alpha1Start}
        bind:endValue={alpha1End}
        bind:disabled={alpha1Disabled}
        {startPlaceholder}
        {endPlaceholder}
        onEnabled={() => handleAlphaChannelEnabled()}
        onDisabled={() => handleAlphaChannelDisabled()}
    />

    <InputBox
        label="Alpha 2"
        bind:this={inputBoxAlpha2}
        bind:startValue={alpha2Start}
        bind:endValue={alpha2End}
        bind:disabled={alpha2Disabled}
        {startPlaceholder}
        {endPlaceholder}
        onEnabled={() => handleAlphaChannelEnabled()}
        onDisabled={() => handleAlphaChannelDisabled()}
    />

    <InputBox
        label="Alpha 3"
        bind:this={inputBoxAlpha3}
        bind:startValue={alpha3Start}
        bind:endValue={alpha3End}
        bind:disabled={alpha3Disabled}
        {startPlaceholder}
        {endPlaceholder}
        onEnabled={() => handleAlphaChannelEnabled()}
        onDisabled={() => handleAlphaChannelDisabled()}
    />

    <InputBox
        label="Alpha 4"
        bind:this={inputBoxAlpha4}
        bind:startValue={alpha4Start}
        bind:endValue={alpha4End}
        bind:disabled={alpha4Disabled}
        {startPlaceholder}
        {endPlaceholder}
        onEnabled={() => handleAlphaChannelEnabled()}
        onDisabled={() => handleAlphaChannelDisabled()}
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
        {text.aplicarAlpha}
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
