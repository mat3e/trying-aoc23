export function parseLine(line) {
    const [winning, got] = line.split(': ')[1].split(' | ');
    return [splitWhitespaceSeparatedNumbers(winning), splitWhitespaceSeparatedNumbers(got)];
}

function splitWhitespaceSeparatedNumbers(numbers) {
    return numbers.split(' ')
        .map(candidate => candidate.trim())
        .filter(candidate => candidate.length > 0)
        .map(potentialNumber => +(potentialNumber));
}

export function calculate(winningNumbers, numbersGot) {
    const winningSet = new Set(winningNumbers);
    const matching = numbersGot.filter(number => winningSet.has(number)).length;
    switch (matching) {
        case 0:
            return 0;
        case 1:
            return 1;
        case 2:
            return 2;
        default:
            return 2 ** (matching - 1);
    }
}

/*const input = `input here`;

console.info(
    input.split('\n')
        .map(parseLine)
        .map(([winning, got]) => calculate(winning, got))
        .reduce((sum, curr) => sum + curr, 0));*/
