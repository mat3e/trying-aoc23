import {classifyHand, compareHands, endGame, playGame} from './7-2';

describe('classifyHand', () => {
    it.each([
        ['AAAAA', 6],
        ['KTJJT', 5],
        ['AA8AA', 5],
        ['QJJQ2', 5],
        ['23332', 4],
        ['TTT98', 3],
        ['23432', 2],
        ['A23A4', 1],
        ['23456', 0],
    ])('recognizes proper hand (%s)', (hand, expected) => {
        expect(classifyHand(hand)).toEqual(expected);
    });
});

describe('compareHands', () => {
    it.each([
        ['QQQJA', 'KTJJT', false],
        ['33332', '2AAAA', true],
        ['77888', '77788', true],
        ['23332', 'AAAAA', false],
        ['JKKK2', 'TTTT2', false],
    ])('uses bigger classification then card by card from left (%s, %s)', (firstHand, secondHand, firstWins) => {
        expect(compareHands(firstHand, secondHand) > 0).toBe(firstWins);
    });
});

describe('playGame', () => {
    it('sorts hands from worst to best', () => {
        const result = playGame(
            `32T3K 765
            T55J5 684
            KK677 28
            KTJJT 220
            QQQJA 483`);

        expect([...result.entries()]).toEqual([
            ['32T3K', 765],
            ['KK677', 28],
            ['T55J5', 684],
            ['QQQJA', 483],
            ['KTJJT', 220],
        ]);
    });
});

describe('endGame', () => {
    it('calculates total bid', () => {
        expect(endGame(
            `32T3K 765
            T55J5 684
            KK677 28
            KTJJT 220
            QQQJA 483`)).toEqual(5905);
    });
});
