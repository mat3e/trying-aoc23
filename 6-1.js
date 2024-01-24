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

// replace 0s with input pairs
console.log([[0, 0], [0, 0], [0, 0], [0, 0]]
    .map(([time, distance]) => calculateDistances(time, distance).length)
    .reduce((a, b) => a * b, 1));
