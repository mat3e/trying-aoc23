import {calculateResult, extrapolateBackwards, parseInput} from './9-2.js';

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

describe('extrapolateBackwards', () => {
    it.each([
        [[0, 3, 6, 9, 12, 15], -3],
        [[1, 3, 6, 10, 15, 21], 0],
        [[10, 13, 16, 21, 30, 45], 5],
    ])('returns new value based on previous differences', (input, expected) => {
        expect(extrapolateBackwards(input)).toEqual(expected);
    });
});

describe('calculateResult', () => {
    it('sums all extrapolated values', () => {
        expect(calculateResult(
            `0 3 6 9 12 15
            1 3 6 10 15 21
            10 13 16 21 30 45`
        )).toEqual(2);
    });
});
