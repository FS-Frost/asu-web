<script lang="ts">
    type Props = {
        onFilesSelected: (files: File[]) => void;
        loading: boolean;
    };

    let { onFilesSelected, loading }: Props = $props();

    let inputFiles = $state<HTMLInputElement>();
    let isDragging = $state<boolean>(false);
    let dragCounter = 0;

    function handleDragEnter(event: DragEvent): void {
        event.preventDefault();
        dragCounter++;
        isDragging = true;
    }

    function handleDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    function handleDragLeave(): void {
        dragCounter--;
        if (dragCounter <= 0) {
            isDragging = false;
            dragCounter = 0;
        }
    }

    async function handleDrop(event: DragEvent): Promise<void> {
        event.preventDefault();
        isDragging = false;
        dragCounter = 0;

        if (loading) return;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            onFilesSelected(Array.from(files));
        }
    }

    function handleFileChange() {
        if (inputFiles?.files) {
            onFilesSelected(Array.from(inputFiles.files));
            inputFiles.value = "";
        }
    }
</script>

<div
    class="uploader-container"
    class:is-dragging={isDragging}
    ondragenter={handleDragEnter}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    role="region"
    aria-label="Cargador de archivos"
>
    {#if isDragging}
        <div class="drop-overlay">
            <div class="drop-message">
                <i class="fas fa-file-upload fa-3x mb-4"></i>
                <p>Suelta los archivos aquí para procesarlos</p>
            </div>
        </div>
    {/if}

    <div class="file is-fullwidth mb-2">
        <label class="file-label">
            <input
                class="file-input"
                type="file"
                bind:this={inputFiles}
                accept=".ass"
                onchange={handleFileChange}
                multiple
                disabled={loading}
            />
            <span class="file-cta">
                <span class="file-icon">
                    <i class="fas fa-upload"></i>
                </span>
                <span class="file-label"> Cargar subtítulos </span>
            </span>
        </label>
    </div>
</div>

<style>
    .uploader-container {
        position: relative;
        width: 100%;
    }

    .drop-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(48, 63, 159, 0.15);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        border: 3px dashed #4a4a4a;
        border-radius: 1rem;
        pointer-events: none;
        animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .drop-message {
        text-align: center;
        color: #4a4a4a;
        font-size: 1.5rem;
        font-weight: bold;
        background: white;
        padding: 3rem;
        border-radius: 1.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        transform: scale(1);
        animation: pulse 1.5s infinite ease-in-out;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .file-cta {
        width: 100%;
    }
</style>
