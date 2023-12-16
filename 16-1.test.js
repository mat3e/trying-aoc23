import { solve } from './16-1.js';

describe('solve', () => {
    it('should find 46 energized entries', () => {
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
            ..//.|....`)
        ).toBe(46);
    });
});
