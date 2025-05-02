export function downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.download = fileName;
    anchor.href = url;
    anchor.target = "_blank";
    anchor.click();
    URL.revokeObjectURL(url);
}
