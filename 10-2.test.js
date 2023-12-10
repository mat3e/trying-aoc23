import {Graph} from './10-2';

describe('Graph', () => {
    it('counts enclosed elements', () => {
        expect(new Graph(
            `...........
            .S-------7.
            .|F-----7|.
            .||.....||.
            .||.....||.
            .|L-7.F-J|.
            .|..|.|..|.
            .L--J.L--J.
            ...........`
        ).enclosed).toBe(4);
    });

    it('counts enclosed assuming squeezing between pipes', () => {
        expect(new Graph(
            `..........
            .S------7.
            .|F----7|.
            .||OOOO||.
            .||OOOO||.
            .|L-7F-J|.
            .|II||II|.
            .L--JL--J.
            ..........`
        ).enclosed).toBe(4);
        expect(new Graph(
            `........
            .S----7.
            .|F--7|.
            .||OOLJ.
            .||OOF7.
            .|L--J|.
            .|IIII|.
            .L----J.
            ........`
        ).enclosed).toBe(4);
    });
});
