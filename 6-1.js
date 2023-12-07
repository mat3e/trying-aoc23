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

/*
Time:        40     81     77     72
Distance:   219   1012   1365   1089
 */

console.log([[40, 219], [81, 1012], [77, 1365], [72, 1089]]
    .map(([time, distance]) => calculateDistances(time, distance).length)
    .reduce((a, b) => a * b, 1));
