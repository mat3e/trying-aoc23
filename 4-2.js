export function parseLine(line) {
    const cardAndArrays = line.split(': ');
    const card = +(cardAndArrays[0].replace(/Card /i, '').trim());
    const [winning, got] = cardAndArrays[1].split(' | ');
    return [card, [splitWhitespaceSeparatedNumbers(winning), splitWhitespaceSeparatedNumbers(got)]];
}

function splitWhitespaceSeparatedNumbers(numbers) {
    return numbers.split(' ')
        .map(candidate => candidate.trim())
        .filter(candidate => candidate.length > 0)
        .map(potentialNumber => +(potentialNumber));
}

export function calculate(winningNumbers, numbersGot) {
    const winningSet = new Set(winningNumbers);
    return numbersGot.filter(number => winningSet.has(number)).length;
}

const input = `input here`;

export function iterator(input) {
    /** @type {Map<number, [number, number]>} */
    const parsedSource = new Map(input.split('\n').map(parseLine));
    const state = new Map([...parsedSource.keys()].map(cardNumber => [cardNumber, 1]));
    const toProcess = [...parsedSource.keys()].reverse();
    return {
        hasNext() {
            return toProcess.length > 0;
        },
        next() {
            if(!this.hasNext()) {
                return;
            }
            const currentCard = toProcess.pop();
            const cardsToMultiply = calculate(...parsedSource.get(currentCard));
            for (let i = 1; i <= cardsToMultiply; i++) {
                const followingCard = currentCard + i;
                state.set(followingCard, state.get(followingCard) + state.get(currentCard));
            }
        },
        get state() {
            return state;
        },
    };
}

/*const iteratorForInput = iterator(input);
while(iteratorForInput.hasNext()) {
    iteratorForInput.next();
}
console.log([...iteratorForInput.state.values()].reduce((sum, curr) => sum + curr, 0));*/
