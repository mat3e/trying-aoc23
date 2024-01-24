// console.log(traverse(`input here`))

export function traverse(input) {
    const [instructions, , ...nodes] = input.split('\n');
    const steps = parseInstructions(instructions);
    const map = parseNodes(...nodes);
    let count = 0;
    for (
        let currentNode = 'AAA', currentNeighbors = map[currentNode];
        currentNode !== 'ZZZ';
        currentNode = currentNeighbors[steps.next().value], currentNeighbors = map[currentNode]
    ) {
        count++;
    }
    return count;
}

export function* parseInstructions(input) {
    const instructions = input.split('');
    const dictionary = {
        'L': 0,
        'R': 1
    };
    for (let index = 0; ; index++) {
        yield dictionary[instructions[index % instructions.length]];
    }
}

export function parseNodes(...input) {
    return input
        .map(line => line.split(' = '))
        .map(([key, pair]) => {
            const [, left, right] = /\(([A-Z]+), ([A-Z]+)\)/.exec(pair)
            return [
                key.trim(),
                [left, right]
            ];
        })
        .reduce((acc, [key, pair]) => {
            acc[key] = pair;
            return acc;
        }, {});
}
