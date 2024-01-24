export function calculateDistances(time, distance) {
    const results = [];
    for (let i = 1; i < time; i++) {
        const v = i;
        const t = time - i;
        const s = v * t;
        if (s >= distance) {
            results.push(s);
        }
    }
    return results;
}

console.log(calculateDistances(0, 0).length);
