const POINTED = 'O';
const EMPTY = '.';
const SOLID = '#';

export function solve(input) {
    let result = 0;
    const lines = input.split('\n').map((line) => line.trim());
    const cols = [];
    for (let i = 0; i < lines[0].length; i++) {
        cols.push([]);
    }
    for (let i = 0; i < lines[0].length; i++) {
        if (lines[0][i] === POINTED) {
            result += lines.length; // max prize
            continue;
        }
        if (lines[0][i] === EMPTY) {
            cols[i].push(lines.length);
        }
    }
    for (let i = 1; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            switch (char) {
                case POINTED:
                    const resultFromCols = cols[j].shift();
                    if (!resultFromCols) {
                        result += lines.length - i;
                        break;
                    }
                    result += resultFromCols;
                case EMPTY:
                    cols[j].push(lines.length - i);
                    break;
                default:
                    // SOLID
                    cols[j] = [];
                    break;
            }
        }
    }
    return result;
}

console.time();
console.log(solve(
    `input here`));
console.timeEnd();
