import {calculateResult, extrapolate, parseInput} from './9-1.js';

describe('parseInput', () => {
    it('returns arrays', () => {
        expect(parseInput(
            `0 3 6 9 12 15
            1 3 6 10 15 21
            10 13 16 21 30 45`
        )).toEqual([
            [0, 3, 6, 9, 12, 15],
            [1, 3, 6, 10, 15, 21],
            [10, 13, 16, 21, 30, 45],
        ]);
    });
});

describe('extrapolate', () => {
    it.each([
        [[0, 3, 6, 9, 12, 15], 18],
        [[1, 3, 6, 10, 15, 21], 28],
        [[10, 13, 16, 21, 30, 45], 68],
    ])('returns new value based on previous differences', (input, expected) => {
        expect(extrapolate(input)).toEqual(expected);
    });
});

describe('calculateResult', () => {
    it('sums all extrapolated values', () => {
        expect(calculateResult(
            `0 3 6 9 12 15
            1 3 6 10 15 21
            10 13 16 21 30 45`
        )).toEqual(114);
    });
});
