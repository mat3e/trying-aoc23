import {solve } from './14-1.js';

test('solve', () => {
    expect(solve(
        `O....#....
        O.OO#....#
        .....##...
        OO.#O....O
            .O.....O#.
        O.#..O.#.#
        ..O..#O..O
        .......O..
        #....###..
        #OO..#....`)).toBe(136);
});
