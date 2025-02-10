export function trimEnd(s: string, sufix: string): string {
    while (s.endsWith(sufix)) {
        s = s.substring(0, s.length - sufix.length);
    }

    return s;
}
