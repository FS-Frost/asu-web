<script lang="ts">
    import { onMount } from "svelte";
    import * as asu from "$lib/asu/asu.browser";
    import InputBox from "./InputBox.svelte";
    import { generateHexArray } from "$lib/carteles";

    const title: string = "Aplicar alpha";

    let rawTargetLines: string = "";
    let rawResultLines: string = "";
    let alphaTotalStart: string = "0";
    let alphaTotalEnd: string = "FF";

    let alphaTotalDisabled: boolean = false;
    let alpha1Disabled: boolean = true;
    let alpha2Disabled: boolean = true;
    let alpha3Disabled: boolean = true;
    let alpha4Disabled: boolean = true;

    let inputBoxAlphaTotal: InputBox;
    let inputBoxAlpha1: InputBox;
    let inputBoxAlpha2: InputBox;
    let inputBoxAlpha3: InputBox;
    let inputBoxAlpha4: InputBox;

    let reverseLinesEnabled: boolean = false;

    function handleAlphaTotalEnabled(): void {
        inputBoxAlpha1.disable();
        inputBoxAlpha2.disable();
        inputBoxAlpha3.disable();
        inputBoxAlpha4.disable();
    }

    function handleAlphaTotalDisabled(): void {
        if (
            alpha1Disabled &&
            alpha2Disabled &&
            alpha3Disabled &&
            alpha4Disabled
        ) {
            inputBoxAlpha1.enable();
            inputBoxAlpha2.disable();
            inputBoxAlpha3.disable();
            inputBoxAlpha4.disable();
        }
    }

    function handleAlphaChannelEnabled(): void {
        inputBoxAlphaTotal.disable();
    }

    function handleAlphaChannelDisabled(): void {
        if (
            alpha1Disabled &&
            alpha2Disabled &&
            alpha3Disabled &&
            alpha4Disabled
        ) {
            inputBoxAlphaTotal.enable();
        }
    }

    async function processLines(): Promise<void> {
        let startValue = 0;
        let endValue = 255;
        let alphaTotalHexValues: string[] = [];

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
            startValue = asu.hexToNumber(alphaTotalStart);
            endValue = asu.hexToNumber(alphaTotalEnd);

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

            alphaTotalHexValues = generateHexArray(startValue, endValue);
            if (reverseLinesEnabled) {
                alphaTotalHexValues.reverse();
            }

            let result = "";
            console.log(alphaTotalHexValues);
            for (let i = 0; i < lines.length; i++) {
                let alphaIndex = Math.floor(
                    (alphaTotalHexValues.length * i) / lines.length,
                );

                if (alphaIndex >= alphaTotalHexValues.length) {
                    alphaIndex = alphaTotalHexValues.length - 1;
                }

                const alphaValue = alphaTotalHexValues[alphaIndex];
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
            await navigator.clipboard.writeText(result);
            alert(`¡Líneas copiadas al portapapeles: ${lines.length}!`);
            return;
        }

        // if (chbox_Invertir.IsChecked.Value) {
        //     lineas.reverse();
        // }

        // Lista con las listas alpha.
        // var listasAlpha = new List<List<string>> {
        //     listaAlpha1,
        //     listaAlpha2,
        //     listaAlpha3,
        //     listaAlpha4
        // };

        // Lista con formatos alpha.
        // Cada formato se usará en string.Format(),
        // de ahí el {0} para colocar el valor automáticamente.
        // var listaFormatoAlpha = new List<string> {
        //     @"\1a&H{0}&",
        //     @"\2a&H{0}&",
        //     @"\3a&H{0}&",
        //     @"\4a&H{0}&"
        // };

        // var listaSelecciones = new List<bool> {
        //     chbox_Valor1.IsChecked.Value,
        //     chbox_Valor2.IsChecked.Value,
        //     chbox_Valor3.IsChecked.Value,
        //     chbox_Valor4.IsChecked.Value
        // };

        // if (!chbox_ValorTotal.IsChecked.Value) {
        //     // Si se usan todos los alpha.
        //     for (var i = 0; i < listasAlpha.Count; i++) {
        //         if (listaSelecciones[i]) {
        //             lineas = AplicarListaAlpha(lineas, listasAlpha[i], listaFormatoAlpha[i]);
        //         }
        //     }
        // } else {
        // Si se usa solo alpha total.
        // lineas = AplicarListaAlpha(lineas, listaAlphaTotal, @"\alpha&H{0}&");
        // }

        // Se invierte el orden de líneas si se habilita la opción.
        // if (chbox_Invertir.IsChecked.Value) {
        //     lineas.reverse();
        // }

        // await navigator.clipboard.writeText(result);
        alert("¡Líneas copiadas al portapapeles!");
    }

    onMount(() => {
        rawTargetLines +=
            "Dialogue: 0,0:00:00.00,0:00:05.00,Default,,0,0,0,,{\\pos(182,421)}LINEA 1\n";

        rawTargetLines +=
            "Dialogue: 0,0:00:00.00,0:00:05.00,Default,,0,0,0,,{\\pos(470,361)}LINEA 2";
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section>
    <h1 class="title is-5">{title}</h1>

    <label class="label" for="">Configuración Alpha</label>

    <InputBox
        label="Alpha total"
        bind:this={inputBoxAlphaTotal}
        bind:disabled={alphaTotalDisabled}
        on:enabled={() => handleAlphaTotalEnabled()}
        on:disabled={() => handleAlphaTotalDisabled()}
    />

    <InputBox
        label="Alpha 1"
        bind:this={inputBoxAlpha1}
        bind:disabled={alpha1Disabled}
        on:enabled={() => handleAlphaChannelEnabled()}
        on:disabled={() => handleAlphaChannelDisabled()}
    />

    <InputBox
        label="Alpha 2"
        bind:this={inputBoxAlpha2}
        bind:disabled={alpha2Disabled}
        on:enabled={() => handleAlphaChannelEnabled()}
        on:disabled={() => handleAlphaChannelDisabled()}
    />

    <InputBox
        label="Alpha 3"
        bind:this={inputBoxAlpha3}
        bind:disabled={alpha3Disabled}
        on:enabled={() => handleAlphaChannelEnabled()}
        on:disabled={() => handleAlphaChannelDisabled()}
    />
    <InputBox
        label="Alpha 4"
        bind:this={inputBoxAlpha4}
        bind:disabled={alpha4Disabled}
        on:enabled={() => handleAlphaChannelEnabled()}
        on:disabled={() => handleAlphaChannelDisabled()}
    />

    <label class="checkbox reverse">
        <input type="checkbox" bind:checked={reverseLinesEnabled} />
        Aplicar inversamente
    </label>

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

    <button class="button is-link is-fullwidth" on:click={() => processLines()}>
        Aplicar alpha
    </button>

    <div class="field mt-2">
        <label class="label" for="">Resultado</label>
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
