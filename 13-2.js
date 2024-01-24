export function solve(input) {
    let result = 0;
    input.split('\n\n').map((pattern) => {
        const patternCharLines = pattern.split('\n').map(line => line.split(''));
        result += calculateMatches(patternCharLines, 100);
        result += calculateMatches(transpose(patternCharLines), 1);
    });
    return result;
}

function calculateMatches(patternLines, multiplier) {
    let result = 0;
    for (let i = 1; i < patternLines.length; i++) {
        const initialDiffs = countDifferentChars(patternLines[i - 1], patternLines[i]);
        if (initialDiffs === 0 || initialDiffs === 1) {
            let diffs = initialDiffs;
            let startIndex = i - 2;
            let endIndex = i + 1;
            for (; startIndex >= 0 && endIndex < patternLines.length; startIndex--, endIndex++) {
                diffs += countDifferentChars(patternLines[startIndex], patternLines[endIndex]);
                if (diffs > 1) {
                    break;
                }
            }
            if (diffs === 1 && (startIndex === -1 || endIndex === patternLines.length)) {
                result += multiplier * i;
            }
        }
    }
    return result;
}

function countDifferentChars(first, second) {
    let differentChars = 0;
    for (let i = 0; i < first.length; i++) {
        if (first[i] !== second[i]) {
            ++differentChars;
        }
    }
    return differentChars;
}

function transpose(arr) {
    return arr[0].map((_, i) => arr.map(row => row[i]));
}

console.time();
console.log(solve(
    `input here`
));
console.timeEnd();
