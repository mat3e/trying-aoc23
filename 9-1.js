console.log(calculateResult(`input here`));

export function calculateResult(input) {
    return parseInput(input)
        .map(array => extrapolate(array))
        .reduce((sum, curr) => sum + curr, 0);
}

export function parseInput(input) {
    return input.split('\n').map(line => line.trim().split(' ').map(Number));
}

export function extrapolate(array) {
    if (array.every(element => element === 0)) {
        return 0;
    }
    return array[array.length - 1] + extrapolate(diffs(array));
}

function diffs(array) {
    const result = [];
    for (let i = 1; i < array.length; i++) {
        result.push(array[i] - array[i - 1]);
    }
    return result
}
