<script lang="ts">
    import Modal from "$lib/gui/Modal.svelte";
    import text from "$lib/text";
    import { SUBTITLE_MODES } from "$lib/validateSubtitles";
    import { Options, saveOptions } from "./validarDialogosOptions";

    type Props = {
        options: Options;
    };

    let { options = $bindable() }: Props = $props();

    let modal = $state<Modal>();

    export function open(): void {
        modal?.open();
    }

    export function close(): void {
        modal?.close();
    }

    function resetSettings(): void {
        const doContinue = confirm("¿Reiniciar configuración?");
        if (!doContinue) {
            return;
        }

        options = Options.parse({});
    }
</script>

<Modal
    bind:this={modal}
    title="Configuración"
    cancelButtonText="Volver"
    onClose={() => saveOptions(options)}
>
    <button
        class="button is-danger is-outlined is-fullwidth mb-2"
        onclick={resetSettings}
    >
        Reiniciar configuración
    </button>

    <div class="select is-fullwidth mb-2">
        <select bind:value={options.userSubsMode}>
            {#each SUBTITLE_MODES as mode}
                <option value={mode}>Modo {mode}</option>
            {/each}
        </select>
    </div>

    <div class="field">
        <label class="checkbox">
            <input type="checkbox" bind:checked={options.geminiEnabled} />
            {text.validateWithGemini}
        </label>

        {#if options.geminiEnabled}
            <div class="field">
                <label class="label" for="">API KEY</label>
                <div class="control">
                    <input
                        class="input"
                        type="password"
                        bind:value={options.geminiApiKey}
                        placeholder="Ingresa tu API KEY"
                    />
                </div>
            </div>

            <p>
                <a href="https://aistudio.google.com/apikey" target="_blank">
                    Clic aquí para obtener una API KEY.
                </a>
            </p>

            <p>
                Las validaciones de Google Gemini serán siempre advertencias
                debido a su tendencia a tener falsos positivos.
            </p>
        {/if}
    </div>

    <div class="field">
        <label class="checkbox">
            <input
                type="checkbox"
                bind:checked={options.validateLineStyleExists}
            />
            {text.validateLineStyleExists}
        </label>
    </div>

    <div class="field">
        <label class="checkbox">
            <input type="checkbox" bind:checked={options.validateTextStart} />
            {text.validateTextStart}
        </label>
    </div>

    <div class="field">
        <label class="checkbox">
            <input type="checkbox" bind:checked={options.validateTextEnd} />
            {text.validateTextEnd}
        </label>
    </div>

    <div class="field">
        <label class="checkbox">
            <input type="checkbox" bind:checked={options.validateTextSpaces} />
            {text.validateTextSpaces}
        </label>
    </div>

    <div class="field">
        <label class="checkbox">
            <input
                type="checkbox"
                bind:checked={options.validateTextPunctuation}
            />
            {text.validateTextPunctuation}
        </label>
    </div>
</Modal>
