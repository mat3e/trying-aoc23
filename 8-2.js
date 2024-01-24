// console.log(traverse(`input here`));

export function traverse(input) {
    const [instructions, , ...nodes] = input.split('\n');
    const steps = () => parseInstructions(instructions);
    const map = parseNodes(...nodes);
    const tillZ = Object.keys(map)
        .filter(node => node.endsWith('A'))
        .map(node => traverseToZ(steps, map, node));
    console.log(tillZ);
    console.log(instructions.length);
    return leastCommonMultiple(...tillZ, instructions.length);
}

function traverseToZ(stepsFactory, map, currentNode) {
    const steps = stepsFactory();
    let count = 0;
    while (!currentNode.endsWith('Z')) {
        const step = steps.next().value;
        currentNode = doTraverse(step, map, currentNode);
        count++;
    }
    return count;
}

function doTraverse(step, map, currentNode) {
    const currentNeighbors = map[currentNode];
    currentNode = currentNeighbors[step];
    return currentNode;
}

export function leastCommonMultiple(first, ...numbers) {
    if (numbers.length === 1) {
        return first * numbers[0] / greatestCommonDivisor(first, numbers[0]);
    }
    return leastCommonMultiple(first, leastCommonMultiple(...numbers));
}

function greatestCommonDivisor(a, b) {
    if (a === 0) {
        return b;
    }
    if (b === 0) {
        return a;
    }
    return greatestCommonDivisor(b, a % b);
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
            const [, left, right] = /\(([A-Z0-9]+), ([A-Z0-9]+)\)/.exec(pair)
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
