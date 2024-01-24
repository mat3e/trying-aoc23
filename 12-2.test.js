import {countAllArrangements, countMatches} from './12-2';

describe('countMatches', () => {
    it.each([
        ['???.###', [1, 1, 3], 1],
        ['?######.#####', [6, 5], 1],
        ['????.######..#####.', [1, 6, 5], 4],
        ['???', [1, 1], 1],
        ['#', [1], 1],
        ['#?', [1], 1],
        ['#?', [2], 1],
        ['.??..??...?##.', [1, 1, 3], 4],
        ['?#?#?#?#?#?#?#?', [1, 3, 1, 6], 1],
        ['?###????????', [3, 2, 1], 10],
    ])('returns how many times %s matches %s', (pattern, sizes, expected) => {
        expect(countMatches(pattern, ...sizes)).toBe(expected);
    });
});

describe('countAllArrangements', () => {
    it('calculates properly', () => {
        expect(countAllArrangements('.??..??...?##. 1,1,3', 5)).toBe(16384);
        expect(countAllArrangements(
            `???.### 1,1,3
            .??..??...?##. 1,1,3
            ?#?#?#?#?#?#?#? 1,3,1,6
            ????.#...#... 4,1,1
            ????.######..#####. 1,6,5
            ?###???????? 3,2,1`, 5)).toBe(525152);
    });
});
