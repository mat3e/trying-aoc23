import {Graph} from './10-1';

describe('Graph', () => {
    it('creates of proper size', () => {
        const result = new Graph(
            `.....
            .F-7.
            .|.|.
            .L-J.
            .....`);

        expect(result).toHaveLength(8);
    });

    it('creates with "S" placeholder', () => {
        const result = new Graph(
            `.....
            .S-7.
            .|.|.
            .L-J.
            .....`);

        expect(result).toHaveLength(8);
    });

    it('returns just cycle length', () => {
        const result = new Graph(
            `-L|F7
            7S-7|
            L|7||
            -L-J|
            L|-JF`);

        expect(result).toHaveLength(8);
    });

    it('works with complex example', () => {
        expect(new Graph(
            `..F7.
            .FJ|.
            SJ.L7
            |F--J
            LJ...`
        )).toHaveLength(16);

        expect(new Graph(
            `7-F7-
            .FJ|7
            SJLL7
            |F--J
            LJ.LJ`
        )).toHaveLength(16);
    });

    it('finds max distance', () => {
        expect(new Graph(
            `.....
            .S-7.
            .|.|.
            .L-J.
            .....`
        ).maxDistance).toBe(4);

        expect(new Graph(
            `..F7.
            .FJ|.
            SJ.L7
            |F--J
            LJ...`
        ).maxDistance).toBe(8);
    });
});
