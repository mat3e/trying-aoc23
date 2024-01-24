const cache = new Map();

export function occursInTestArea(first, second, min, max) {
    if (!cache.has(first)) {
        const parsedFirst = parse(first);
        cache.set(first, [findLinearFunction(parsedFirst), parsedFirst]);
    }
    if (!cache.has(second)) {
        const parsedSecond = parse(second);
        cache.set(second, [findLinearFunction(parsedSecond), parsedSecond]);
    }
    const [firstFunction, firstObject] = cache.get(first);
    const [secondFunction, secondObject] = cache.get(second);
    const {x, y} = functionsCrossPoint(firstFunction, secondFunction);
    return x >= min && x <= max && y >= min && y <= max
        && isBefore(firstObject.x, firstObject.vx, x) && isBefore(firstObject.y, firstObject.vy, y)
        && isBefore(secondObject.x, secondObject.vx, x) && isBefore(secondObject.y, secondObject.vy, y);
}

// e.g. '19, 13, 30 @ -2, 1, -2'
function parse(line) {
    const [position, velocity] = line.trim().split(' @ ');
    const [x, y] = position.split(', ').map(Number);
    const [vx, vy] = velocity.split(', ').map(Number);
    return {x, y, vx, vy};
}

function findLinearFunction({x, y, vx, vy}) {
    // y = ax + b => y - ax = b
    // y+vy = a(x+vx) + b => y+vy - (y - ax) = a(x+vx) => vy + ax = a(x+vx) => vy = a(x+vx - x) => vy/vx = a
    return {a: vy / vx, b: y - (vy / vx) * x}
}

function functionsCrossPoint({a, b}, second) {
    // y = ax + b
    // y = a2x + b2 => ax + b = a2x + b2 => x(a - a2) = b2 - b => x = (b2 - b)/(a - a2)
    const x = (second.b - b) / (a - second.a);
    return {x, y: a * x + b}
}

function isBefore(position, velocity, target) {
    return (position >= target && velocity < 0) || (position <= target && velocity > 0);
}

const input = `input here`;
console.time();
const lines = input.split('\n');
let result = 0;
for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
        if (occursInTestArea(lines[i], lines[j], 200000000000000, 400000000000000)) {
            ++result;
        }
    }
}
console.info(result);
console.timeEnd();
