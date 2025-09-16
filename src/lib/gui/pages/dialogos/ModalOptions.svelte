<script lang="ts">
    import Modal from "$lib/gui/Modal.svelte";
    import text from "$lib/text";
    import Swal from "sweetalert2";
    import {
        GEMINI_MODELS,
        Options,
        saveOptions,
    } from "./validarDialogosOptions";
    import { SUBTITLE_MODES } from "$lib/subtitleMode";

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

    async function sakujoSettings(): Promise<void> {
        let html = `
            <div
                style="
                    display: flex;
                    position: relative;
                    text-align: center;
                    height: 16rem;
                    overflow: hidden;
                "
            >
                <p
                    style="
                        position: absolute;
                        width: 100%;
                        top: 2%;
                        z-index: 2;
                        color: white;
                        text-shadow: 0.05rem 0.05rem 0.05rem black;
                    "
                >
                    <i>Nota: "sakujo" significa eliminar.</i>
                </p>

                <img
                    src="img/mikami-teru.gif"
                    alt="Death Note"
                    title="Death Note"
                    style="
                        position: absolute;
                        height: 16rem;
                    "
                />
            </div>
        `;

        const swalResult = await Swal.fire({
            title: "¿Sakujo configuración?",
            html: html,
            confirmButtonText: "¡Sakujo!",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            customClass: {
                confirmButton: "swal2-deny",
            },
        });

        if (!swalResult.isConfirmed) {
            return;
        }

        options = Options.parse({});

        html = `
            <img
                src="img/lelouch.gif"
                alt="Code Geass"
                title="Code Geass"
                style="height: 16rem"
            />
        `;

        await Swal.fire({
            title: "Configuración sakujeada",
            html: html,
            confirmButtonText: "Volver",
        });
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
        onclick={sakujoSettings}
    >
        Sakujo configuración
    </button>

    <div class="select is-fullwidth mb-2">
        <select bind:value={options.userSubsMode}>
            {#each SUBTITLE_MODES as mode}
                <option value={mode}>Modo {mode}</option>
            {/each}
        </select>
    </div>

    <div class="field boxed">
        <label class="checkbox">
            <input type="checkbox" bind:checked={options.geminiEnabled} />
            {text.validateWithGemini}
        </label>

        {#if options.geminiEnabled}
            <label class="label" for="">Modelo</label>
            <div class="select is-fullwidth mb-2">
                <select bind:value={options.geminiModel}>
                    {#each GEMINI_MODELS as model}
                        <option value={model}>{model}</option>
                    {/each}
                </select>
            </div>

            <div class="api-key boxed">
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
                    <a
                        href="https://aistudio.google.com/apikey"
                        target="_blank"
                    >
                        Clic aquí para obtener una API KEY.
                    </a>
                </p>

                <p>
                    Las validaciones de Google Gemini serán siempre advertencias
                    debido a su tendencia a tener falsos positivos.
                </p>
            </div>

            <div class="field mt-1">
                <label class="label" for="">Tokens máximos</label>
                <div class="control">
                    <input
                        class="input"
                        type="number"
                        min="0"
                        step="512"
                        bind:value={options.geminiMaxTokens}
                    />
                </div>
            </div>
        {/if}
    </div>

    <div class="boxed">
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
                <input
                    type="checkbox"
                    bind:checked={options.validateTextStart}
                />
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
                <input
                    type="checkbox"
                    bind:checked={options.validateTextSpaces}
                />
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
    </div>
</Modal>
