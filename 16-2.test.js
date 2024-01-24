import {solveMax} from './16-2.js';

describe('solveMax', () => {
    it('should find 51 energized entries', () => {
        expect(solveMax(
            `.|...\\....
            |.-.\\.....
            .....|-...
            ........|.
            ..........
            .........\\
            ..../.\\\\..
            .-.-/..|..
            .|....-|.\\
            ..//.|....`)
        ).toBe(51);
    });
});

/*test('still works', () => {
    expect(solve(
        `.|...\\....
        |.-.\\.....
        .....|-...
        ........|.
        ..........
        .........\\
        ..../.\\\\..
        .-.-/..|..
        .|....-|.\\
        ..//.|....`.split('\n').map(line => line.trim()),
        ['R', 0, 0]
    )).toBe(46);
});*/
