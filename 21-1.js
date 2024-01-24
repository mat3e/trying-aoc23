let start = '';
const adj = new Map();

function count(input, steps) {
    input.split('\n')
        .map(line => line.trim())
        .forEach((line, y) => {
            for (let x = 0; x < line.length; x++) {
                const char = line[x];
                if (char === '#') {
                    continue;
                }
                if (char === 'S') {
                    start = toPoint(x, y);
                }
                handleValidPoint(x, y);
            }
        });
    let q = new Set([start]);
    let currentSteps = 0;
    while(currentSteps < steps) {
        ++currentSteps;
        q = new Set([...q].flatMap(point => adj.get(point)));
    }
    return new Set(q).size;
}

function handleValidPoint(x, y) {
    const point = toPoint(x, y);
    adj.set(point, []);
    neighbors(x, y)
        .filter(neighbor => adj.has(neighbor))
        .forEach(neighbor => {
            adj.get(point).push(neighbor);
            adj.get(neighbor).push(point);
        });
}

function toPoint(x, y) {
    return `${x},${y}`;
}

function neighbors(x, y) {
    return [
        toPoint(x - 1, y),
        toPoint(x + 1, y),
        toPoint(x, y - 1),
        toPoint(x, y + 1),
    ];
}

console.log(count(
    `input here`,
    64));
