const start = [];
let lines = [];

function count(input, steps) {
    lines = input.split('\n').map(line => line.trim());
    let y = 0;
    for (const line of lines) {
        if (!line.includes('S')) {
            ++y;
            continue;
        }
        start.push(line.indexOf('S'), y);
        break;
    }
    let q = new Set([toPointString(start)]);
    let currentSteps = 0;
    while (currentSteps < steps) {
        ++currentSteps;
        q = new Set([...q].flatMap(neighborsOf));
    }
    return new Set(q).size;
}

const cache = new Map();

function neighborsOf(point) {
    if (cache.has(point)) {
        return cache.get(point);
    }
    const result = neighborCoordinatesOf(...fromPointString(point))
        .filter(([x, y]) => {
            x %= lines[0].length;
            y %= lines.length;
            if (x > lines[0].length - 1) {
                x = x === 0 ? 0 : x - lines[0].length;
            }
            if (x < 0) {
                x += lines[0].length;
            }
            if (y < 0) {
                y += lines.length;
            }
            if (y > lines.length - 1) {
                y = y === 0 ? 0 : y - lines.length;
            }
            return ['.', 'S'].includes(lines[y][x]);
        })
        .map(coordinates => toPointString(...coordinates));
    cache.set(point, result);
    return result;
}

function toPointString(x, y) {
    return `${x},${y}`;
}

function fromPointString(pointString) {
    return pointString.split(',').map(Number);
}

function neighborCoordinatesOf(x, y) {
    return [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
    ];
}

const input = `input here`;

console.time();

// https://www.reddit.com/r/adventofcode/comments/18nevo3/comment/kee6vn6/
// A(t) = a * t*t + b * t + c
/*const A65 = count(input, 65); // 0
const A196 = count(input, 65 + 131); // 1
const A327 = count(input, 65 + 2 * 131); // 2

const {a, b, c} = simplifiedLagrange(A65, A196, A327);
const normalizedSteps = (26_501_365 - 65) / 131;

console.log(a * normalizedSteps ** 2 + b * normalizedSteps + c);*/

console.timeEnd();

// https://www.reddit.com/r/adventofcode/comments/18nevo3/comment/keb6a53/
//  ax^2 + bx + c with x=[0,1,2] and y=[first,second,third]
function simplifiedLagrange(first, second, third) {
    return {
        a: first / 2 - second + third / 2,
        b: -3 * (first / 2) + 2 * second - third / 2,
        c: first,
    };
}
