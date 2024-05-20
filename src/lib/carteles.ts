import * as asu from "./asu/asu.browser";

export function generateHexArray(min: number, max: number): string[] {
    const hexArray: string[] = [];
    for (let i = min; i <= max; i++) {
        const hex = asu.numberToHex(i);
        hexArray.push(hex);
    }
    return hexArray;
}
