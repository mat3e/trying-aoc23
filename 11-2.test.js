import {expand, sumGalaxiesPaths} from './11-2';

describe('expand', () => {
    it('duplicates rows and columns without galaxies', () => {
        // given
        const input =
            `...#......
            .......#..
            #.........
            ..........
            ......#...
            .#........
            .........#
            ..........
            .......#..
            #...#.....`;

        // when
        const [, ...result] = expand(input);

        // then
        expect(result).toEqual([new Set([3, 7]), new Set([2, 5, 8])]);
    });
});

describe('sumGalaxiesPaths', () => {
    it('calculates properly', () => {
        expect(sumGalaxiesPaths(
            `...#......
            .......#..
            #.........
            ..........
            ......#...
            .#........
            .........#
            ..........
            .......#..
            #...#.....`,
            2)
        ).toBe(374);

        expect(sumGalaxiesPaths(
            `...#......
            .......#..
            #.........
            ..........
            ......#...
            .#........
            .........#
            ..........
            .......#..
            #...#.....`,
            10)
        ).toBe(1030);

        expect(sumGalaxiesPaths(
            `...#......
            .......#..
            #.........
            ..........
            ......#...
            .#........
            .........#
            ..........
            .......#..
            #...#.....`,
            100)
        ).toBe(8410);
    });
});
