import {calculate, parseLine} from "./4-1";

describe('calculate', () => {
    it.each([
        [[31, 18, 13, 56, 72], [74, 77, 10, 23, 35, 67, 36, 11]],
        [[87, 83, 26, 28, 32], [88, 30, 70, 12, 93, 22, 82, 36]],
    ])('returns 0 if no match', (winningNumbers, numbersGot) => {
        expect(calculate(winningNumbers, numbersGot)).toBe(0);
    });

    it('returns 1 for a single match', () => {
        expect(calculate([41, 92, 73, 84, 69], [59, 84, 76, 51, 58, 5, 54, 83])).toBe(1);
    });

    it.each([
        [[13, 32, 20, 16, 61], [61, 30, 68, 82, 17, 32, 24, 19]],
        [[1, 21, 53, 59, 44], [69, 82, 63, 72, 16, 21, 14, 1]],
    ])('returns 2 for 2 matches', (winningNumbers, numbersGot) => {
        expect(calculate(winningNumbers, numbersGot)).toBe(2);
    });

    it('returns power of 2 being number of matches minus 1 for matches', () => {
        expect(calculate([41, 48, 83, 86, 17], [83, 86, 6, 31, 17, 9, 48, 53])).toBe(8);
    });
});

describe('parseLine', () => {
    it('translates to 2 arrays', () => {
        const [first, second] = parseLine('Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53');
        expect(first).toEqual([41, 48, 83, 86, 17]);
        expect(second).toEqual([83, 86, 6, 31, 17, 9, 48, 53]);
    });
});

describe('parseLine & calculate', () => {
    it.each([
        ['Card 172: 92  9 73 82 15  6 44 28 88 34 | 99 78 11 46  9 36 89 65 17  8 16 94 68 63 12 54 25 33 69 47 13 38 93 50 59', 1]
    ])('returns correct value', (input, expected) => {
        expect(calculate(...parseLine(input))).toBe(expected);
    });
});
