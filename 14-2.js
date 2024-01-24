const POINTED = 'O';
const EMPTY = '.';
const SOLID = '#';

export function solve(input, cycles = 1_000_000_000) {
    let lines = input.split('\n').map((line) => line.trim());
    let cycleResults = new Map();
    let alreadyRepeated = false;
    for (let i = 0; i < cycles; i++) {
        const [newLines, result] = cycle(lines);
        lines = newLines;
        if (cycleResults.has(result) && !alreadyRepeated) {
            if (cycleResults.get(result)[1] > 10) {
                const repeatLength = i - cycleResults.get(result)[0];
                i = cycles - ((cycles - i) % repeatLength);
                alreadyRepeated = true;
            }
        }
        cycleResults.set(result, [i, 1 + ((cycleResults.get(result) ?? [])[1] ?? 0)]);
        if (alreadyRepeated) {
            console.log(`${i}: ${result}`);
        }
    }
    console.log(lines.join('\n'));
    for (let [result, [iteration]] of [...cycleResults.entries()]) {
        if (iteration === cycles - 1) {
            return result;
        }
    }
    return -1;
}

function cycle(lines) {
    const swappingConsumer = (x, y, prevY) => {
        if (prevY !== undefined) {
            lines[y] = lines[y].substring(0, x) + EMPTY + lines[y].substring(x + 1);
            lines[prevY] = lines[prevY].substring(0, x) + POINTED + lines[prevY].substring(x + 1);
        }
    };
    singleRun(lines, swappingConsumer);
    lines = transpose(lines);
    singleRun(lines, swappingConsumer);
    lines = transpose(lines);
    singleRun(lines, swappingConsumer);
    lines = transpose(lines);
    singleRun(lines, swappingConsumer);
    lines = transpose(lines);
    return [lines, calculateCurrentState(lines)];
}

function singleRun(lines, consumer) {
    const above = [];
    for (let i = 0; i < lines[0].length; i++) {
        above.push([]);
    }
    for (let x = 0; x < lines[0].length; x++) {
        if (lines[0][x] === POINTED) {
            consumer(x, 0);
            continue;
        }
        if (lines[0][x] === EMPTY) {
            above[x].push(0);
        }
    }
    for (let y = 1; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            const char = lines[y][x];
            switch (char) {
                case POINTED:
                    const prevY = above[x].shift();
                    if (prevY === undefined) {
                        consumer(x, y);
                        break;
                    }
                    consumer(x, y, prevY);
                case EMPTY:
                    above[x].push(y);
                    break;
                default:
                    // SOLID
                    above[x] = [];
                    break;
            }
        }
    }
}

function calculateCurrentState(lines) {
    let result = 0;
    lines.forEach((line, y) => {
        for (let char of line) {
            if (char === POINTED) {
                result += lines.length - y;
            }
        }
    });
    return result;
}

function transpose(matrix) {
    return [...Array(matrix[0].length).keys()].map((colIndex) => {
        const newRow = matrix.map(row => row[colIndex]);
        return newRow.reverse().join('');
    });
}

console.log(solve(
    `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`));

console.log(solve(
    `.....#....
....#...O#
...OO##...
.OO#......
.....OOO#.
.O#...O#.#
....O#....
......OOOO
#...O###..
#..OO#....`, 0));

console.time();
console.log(solve(
    `input here`));
console.timeEnd();
