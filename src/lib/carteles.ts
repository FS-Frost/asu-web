import * as asu from "@fs-frost/asu";

export function generateHexArray(min: number, max: number): string[] {
    const hexArray: string[] = [];
    for (let i = min; i <= max; i++) {
        const hex = asu.numberToHex(i);
        hexArray.push(hex);
    }
    return hexArray;
}

export function interpolateColors(startColor: asu.ColorBGR, endColor: asu.ColorBGR, intervals: number): asu.ColorBGR[] {
    const interpolatedColors: asu.ColorBGR[] = Array(intervals);
    const blueValues = asu.interpolate(startColor.blue, endColor.blue, intervals);
    if (blueValues.length !== intervals) {
        console.error(`ERROR: blue interpolated values ${blueValues.length} don't match intervals ${intervals}`);
        return [];
    }

    const greenValues = asu.interpolate(startColor.green, endColor.green, intervals);
    if (greenValues.length !== intervals) {
        console.error(`ERROR: green interpolated values ${greenValues.length} don't match intervals ${intervals}`);
        return [];
    }

    const redValues = asu.interpolate(startColor.red, endColor.red, intervals);
    if (redValues.length !== intervals) {
        console.error(`ERROR: red interpolated values ${redValues.length} don't match intervals ${intervals}`);
        return [];
    }

    for (var i = 0; i < intervals; i++) {
        const blue = Math.floor(blueValues[i]);
        const green = Math.floor(greenValues[i]);
        const red = Math.floor(redValues[i]);

        interpolatedColors[i] = {
            blue: blue,
            green: green,
            red: red,
        };
    }

    return interpolatedColors;
}
