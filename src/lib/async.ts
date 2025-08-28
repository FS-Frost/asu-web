export async function waitUntil(conditionFunction: () => boolean, everyMs: number, untilMs: number | null = null): Promise<boolean> {
    return await new Promise((resolve, _) => {
        let attempts = 0;

        const interval = setInterval(() => {
            attempts++;

            if (untilMs && attempts * everyMs >= untilMs) {
                resolve(false);
                clearInterval(interval);
            }

            if (conditionFunction()) {
                resolve(true);
                clearInterval(interval);
            }
        }, everyMs);
    });
}

export async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
