export function interpolateThreeColors(
    startColor: string,
    middleColor: string,
    endColor: string,
    numberSteps: number,
    stepCount: number
) {
    const t = Math.max(
        0,
        Math.min(1, stepCount / Math.max(1, numberSteps))
    );

    const interpolate = (color1: string, color2: string, ratio: number) => {
        const a = color1.replace("#", "");
        const b = color2.replace("#", "");

        const rgb = [0, 2, 4].map(i => {
            const start = parseInt(a.slice(i, i + 2), 16);
            const end = parseInt(b.slice(i, i + 2), 16);

            return Math.round(start + (end - start) * ratio);
        });

        return `rgb(${rgb.join(", ")})`;
    };

    if (t <= 0.5) {
        return interpolate(startColor, middleColor, t * 2);
    }

    return interpolate(middleColor, endColor, (t - 0.5) * 2);
}

export function interpolateColor(startColor: string, endColor: string, numberSteps: number, stepCount: number) {
    const t = Math.max(0, Math.min(1, stepCount / Math.max(1, numberSteps)));

    const start = startColor.replace("#", "");
    const end = endColor.replace("#", "");

    const rgb = [0, 2, 4].map(i => {
        const a = parseInt(start.slice(i, i + 2), 16);
        const b = parseInt(end.slice(i, i + 2), 16);

        return Math.round(a + (b - a) * t);
    });

    return `rgb(${rgb.join(", ")})`;
}
