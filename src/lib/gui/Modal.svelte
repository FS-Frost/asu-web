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

    const CLASS_IS_ACTIVE = "is-active";

    let modal = $state<Element>();

    export function open() {
        if (modal == null) {
            return;
        }

        modal.classList.add(CLASS_IS_ACTIVE);

        if (onOpen != null) {
            onOpen();
        }
    }

    export function close() {
        if (modal == null) {
            return;
        }

        modal.classList.remove(CLASS_IS_ACTIVE);

        if (onClose != null) {
            onClose();
        }
    }
</script>

<div class="modal" bind:this={modal}>
    <div class="modal-background"></div>
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
