import {expand, GalaxiesGraph, sumGalaxiesPaths} from './11-1';

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
        const result = expand(input);

        // then
        expect(result).toEqual([
            '....#........',
            '.........#...',
            '#............',
            '.............',
            '.............',
            '........#....',
            '.#...........',
            '............#',
            '.............',
            '.............',
            '.........#...',
            '#....#.......']);
    });
});

describe('GalaxiesGraph', () => {
    describe('bfsBetweenGalaxies', () => {
        it('goes through all the galaxies', () => {
            // given
            const graph = new GalaxiesGraph([
                '....#........',
                '.........#...',
                '#............',
                '.............',
                '.............',
                '........#....',
                '.#...........',
                '............#',
                '.............',
                '.............',
                '.........#...',
                '#....#.......']);

            // when
            let found = false;
            graph.bfsBetweenGalaxies('1,6', (pathToOtherGalaxy) => {
                if (pathToOtherGalaxy[pathToOtherGalaxy.length - 1] === '5,11') {
                    expect(pathToOtherGalaxy).toHaveLength(9);
                    found = true;
                }
            });

            // then
            expect(found).toBe(true);
        });

        it('can find just between two galaxies', () => {
            // given
            const graph = new GalaxiesGraph([
                '....#........',
                '.........#...',
                '#............',
                '.............',
                '.............',
                '........#....',
                '.#...........',
                '............#',
                '.............',
                '.............',
                '.........#...',
                '#....#.......']);

            // when
            let found = false;
            graph.bfsBetweenGalaxies(
                '4,0',
                (pathToOtherGalaxy) => {
                    expect(pathToOtherGalaxy).toHaveLength(15);
                    found = true;
                },
                '9,10'
            );

            // then
            expect(found).toBe(true);
        });
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
            #...#.....`)).toBe(374);
    });
});
