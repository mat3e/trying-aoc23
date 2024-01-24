export function solve(input) {
    let result = 0;
    input.split('\n\n').map((pattern) => {
        const patternLines = pattern.split('\n');
        result += calculateMatches(patternLines, 100);
        result += calculateMatches(transpose(patternLines.map(line => line.split(''))).map(line => line.join('')), 1);
    });
    return result;
}

function calculateMatches(patternLines, multiplier) {
    let result = 0;
    for (let i = 1; i < patternLines.length; i++) {
        if (patternLines[i - 1] === patternLines[i]) {
            let startIndex = i - 2;
            let endIndex = i + 1;
            for (; startIndex >= 0 && endIndex < patternLines.length; startIndex--, endIndex++) {
                if (patternLines[startIndex] !== patternLines[endIndex]) {
                    break;
                }
            }
            // we need to go till the end either from one or another side;
            // otherwise it's not a mirror - didn't reflect all the lines
            if (startIndex === -1 || endIndex === patternLines.length) {
                result += multiplier * i;
            }
        }
    }
    return result;
}

function transpose(arr) {
    return arr[0].map((_, i) => arr.map(row => row[i]));
}

console.time();
console.log(solve(
    `input here`
));
console.timeEnd();
