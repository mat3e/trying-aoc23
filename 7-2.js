/**
 * @param {string} hand
 * @type {number}
 */
export function classifyHand(hand) {
    const grouped = new Map();
    for (let card of hand) {
        grouped.set(card, (grouped.get(card) ?? 0) + 1);
    }
    if (!grouped.has('J')) {
        return classifyFrom(grouped);
    }
    const jokerCount = grouped.get('J');
    if (jokerCount === 5) {
        return classifyFrom(grouped);
    }
    grouped.delete('J');
    const [card, count] = [...grouped.entries()].sort(([firstCard, firstCount], [secondCard, secondCount]) => {
        const diff = secondCount - firstCount;
        if (diff === 0) {
            return compareCards(secondCard, firstCard);
        }
        return diff;
    })[0];
    grouped.set(card, count + jokerCount);
    return classifyFrom(grouped);
}

function classifyFrom(grouped) {
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

export function compareHands(first, second) {
    const classificationsDiff = classifyHand(first) - classifyHand(second);
    if (classificationsDiff !== 0) {
        return classificationsDiff;
    }
    for (let i = 0; i < first.length; i++) {
        const cardsDiff = compareCards(first[i], second[i])
        if (cardsDiff === 0) {
            continue;
        }
        return cardsDiff;
    }
}

const cardValues = new Map([
    ['A', 14],
    ['K', 13],
    ['Q', 12],
    ['J', 1],
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

function compareCards(first, second) {
    return cardValues.get(first) - cardValues.get(second);
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
