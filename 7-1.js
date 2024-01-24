/**
 * @param {string} hand
 * @type {number}
 */
export function classifyHand(hand) {
    const grouped = new Map();
    for (let card of hand) {
        grouped.set(card, (grouped.get(card) ?? 0) + 1);
    }
    switch (grouped.size) {
        case 5:
            return 0;
        case 4:
            return 1;
        case 3:
            return [...grouped.values()].some(count => count === 2) ? 2 : 3;
        case 2:
            return [...grouped.values()].some(count => count === 4) ? 5 : 4;
        case 1:
            return 6
        default:
            return -1;
    }
}

const cardValues = new Map([
    ['A', 14],
    ['K', 13],
    ['Q', 12],
    ['J', 11],
    ['T', 10],
    ['9', 9],
    ['8', 8],
    ['7', 7],
    ['6', 6],
    ['5', 5],
    ['4', 4],
    ['3', 3],
    ['2', 2],
]);

export function compareHands(first, second) {
    const classificationsDiff = classifyHand(first) - classifyHand(second);
    if (classificationsDiff !== 0) {
        return classificationsDiff;
    }
    for (let i = 0; i < first.length; i++) {
        const firstCard = first[i];
        const secondCard = second[i];
        if (firstCard === secondCard) {
            continue;
        }
        return cardValues.get(firstCard) - cardValues.get(secondCard);
    }
}

export function playGame(input) {
    return new Map(
        input.split('\n')
            .map(line => {
                return line.trim().split(' ');
            })
            .map(([hand, bid]) => ([hand, +bid]))
            .sort(([firstHand], [secondHand]) => compareHands(firstHand, secondHand))
    );
}

export function endGame(game) {
    return [...playGame(game).values()].reduce((sum, bid, index) => sum + bid * (index + 1), 0);
}

console.log(endGame(`input here`));
