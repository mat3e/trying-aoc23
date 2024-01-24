console.log(calculateResult(`input here`));

export function calculateResult(input) {
    return parseInput(input)
        .map(extrapolateBackwards)
        .reduce((sum, curr) => sum + curr, 0);
}

export function parseInput(input) {
    return input.split('\n').map(line => line.trim().split(' ').map(Number));
}

export function extrapolateBackwards(array) {
    if (array.every(element => element === 0)) {
        return 0;
    }
    return array[0] - extrapolateBackwards(diffs(array));
}

function diffs(array) {
    const result = [];
    for (let i = array.length - 1; i > 0; --i) {
        result.push(array[i] - array[i - 1]);
    }
    return result.reverse();
}
