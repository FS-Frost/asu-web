<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    export let label: string = "";
    export let disabled: boolean = false;
    export let startValue: string = "";
    export let endValue: string = "";

    let checkbox: HTMLInputElement;

    const dispatcher = createEventDispatcher<{
        enabled: undefined;
        disabled: undefined;
    }>();

    function toggleCheck(): void {
        if (checkbox.checked) {
            enable();
            return;
        }

        disable();
    }

    export function enable(): void {
        if (disabled) {
            disabled = false;
            checkbox.checked = true;
            dispatcher("enabled");
        }
    }

    export function disable(): void {
        if (!disabled) {
            disabled = true;
            checkbox.checked = false;
            dispatcher("disabled");
        }
    }

    onMount(() => {
        checkbox.checked = !disabled;
    });
</script>

<div class="field alpha-box">
    <div>
        <label class="checkbox">
            <input
                bind:this={checkbox}
                on:change={() => toggleCheck()}
                type="checkbox"
            />

            {#if disabled}
                {label}
                (deshabilitado)
            {:else}
                <b>{label}</b>
            {/if}
        </label>
    </div>

    <div class="alpha-inputs">
        <div class="alpha-value">
            <label class="label" for="">Valor inicial</label>
            <div class="control">
                <input
                    bind:value={startValue}
                    class="input"
                    type="text"
                    placeholder="0"
                    {disabled}
                />
            </div>
        </div>

        <div class="alpha-value">
            <label class="label" for="">Valor Final</label>
            <div class="control">
                <input
                    bind:value={endValue}
                    class="input"
                    type="text"
                    placeholder="FF"
                    {disabled}
                />
            </div>
        </div>
    </div>
</div>

<style>
    .alpha-box {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        outline: 1px solid lightgray;
        border-radius: 0.4rem;
        width: 100%;
    }

    .alpha-box > div {
        margin-left: 0.5rem;
        margin-top: 0.5rem;
    }

    .alpha-inputs {
        display: flex;
    }

    .alpha-value {
        width: 100%;
    }

    .alpha-inputs > div {
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }
</style>
