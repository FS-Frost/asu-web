export function trimStart(s: string, prefix: string): string {
    while (s.startsWith(prefix)) {
        s = s.substring(prefix.length);
    }

    return s;
}


export function trimEnd(s: string, sufix: string): string {
    while (s.endsWith(sufix)) {
        s = s.substring(0, s.length - sufix.length);
    }

    return s;
}

export function trimSpacesAndEmptyLines(s: string): string {
    let clean = "";
    const lines = s.split("\n");

    for (let line of lines) {
        line = trimStart(line, " ");
        line = trimEnd(line, " ");

        if (line === "") {
            continue;
        }

        clean += "\n" + line;
    }

    return clean;
}
