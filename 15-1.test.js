import { hash } from './15-1';

describe('hash', () => {
    it.each([
        ['HASH', 52],
        ['rn=1', 30],
        ['cm-', 253],
        ['qp=3', 97],
        ['cm=2', 47],
        ['qp-', 14],
        ['pc=4', 180],
        ['ot=9', 9],
        ['ab=5', 197],
        ['pc-', 48],
        ['pc=6', 214],
        ['ot=7', 231],
    ])('returns between 0 and 256 (%s)', (input, expected) => {
        expect(hash(input)).toBe(expected);
    });
});
