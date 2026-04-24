<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        children?: Snippet;
        title: string;
        cancelButtonText: string;
        acceptButtonText?: string;
        acceptButtonDisabled?: boolean;
        onOpen?: (() => void) | null;
        onClose?: (() => void) | null;
        onAccept?: (() => void) | null;
    };

    let {
        children,
        title,
        cancelButtonText = "Cancelar",
        acceptButtonText = "Aceptar",
        acceptButtonDisabled = false,
        onOpen,
        onClose,
        onAccept,
    }: Props = $props();

    let isOpen = $state(false);

    export function open() {
        isOpen = true;
        if (onOpen != null) {
            onOpen();
        }
    }

    export function close() {
        isOpen = false;
        if (onClose != null) {
            onClose();
        }
    }
</script>

<div class="modal {isOpen ? 'is-active' : ''}">
    <div class="modal-background" onclick={() => close()} onkeydown={(e) => e.key === 'Escape' && close()} role="button" tabindex="-1"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">{title}</p>

            <button class="delete" aria-label="close" onclick={() => close()}>
            </button>
        </header>

        <section class="modal-card-body">
            {#if children != null}
                {@render children()}
            {/if}
        </section>

        <footer class="modal-card-foot">
            <button class="button" onclick={() => close()}>
                {cancelButtonText}
            </button>

            {#if onAccept != null}
                <button
                    class="button is-success"
                    disabled={acceptButtonDisabled}
                    onclick={() => onAccept && onAccept()}
                >
                    {acceptButtonText}
                </button>
            {/if}
        </footer>
    </div>
</div>

<style>
    button {
        width: 100%;
    }
</style>
