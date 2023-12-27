import {collides, countRemovals, parseLine, settle, sortByZ, toString} from './22-1';

describe('parseLine', () => {
    it('creates a simple brick object', () => {
        expect(parseLine('2,0,5~2,2,5')).toEqual({
            x: 2,
            y: 0,
            z: 5,
            xLength: 1,
            yLength: 3,
            zLength: 1,
        });

        expect(parseLine('1,1,8~1,1,9')).toEqual({
            x: 1,
            y: 1,
            z: 8,
            xLength: 1,
            yLength: 1,
            zLength: 2,
        });
    });
});

describe('collides', () => {
    it.each([
        ['1,0,1~1,2,1', '0,0,2~2,0,2'],
        ['1,0,1~1,2,1', '0,2,3~2,2,3'],
        ['1,0,1~3,0,1', '2,0,2~2,0,2'],
        ['0,1,6~2,1,6', '1,1,8~1,1,9'],
    ])('finds collision between bricks %s vs. %s', (first, second) => {
        // when
        const result = collides(parseLine(first), parseLine(second));

        // then
        expect(result).toEqual({result: true, x: true, y: true});
    });

    it.each([
        ['0,0,4~0,2,4', '2,0,5~2,2,5', {result: false, x: false, y: true}],
        ['0,0,2~2,0,2', '0,2,3~2,2,3', {result: false, x: true, y: false}],
    ])('does not find collisions between bricks %s vs. %s', (first, second, expected) => {
        // when
        const result = collides(parseLine(first), parseLine(second));

        // then
        expect(result).toEqual(expected);
    });
});

describe('sortByZ', () => {
    it('sorts bricks in ascending order', () => {
        // given
        const input = [
            parseLine('0,2,3~2,2,3'),
            parseLine('0,0,2~2,0,2'),
            parseLine('2,0,5~2,2,5'),
            parseLine('0,0,4~0,2,4'),
            parseLine('1,1,8~1,1,9'),
        ];

        // when
        input.sort(sortByZ);

        // then
        expect(input.map(({z}) => z)).toEqual([2, 3, 4, 5, 8])
    });
});

describe('toString', () => {
    it('can return string back', () => {
        expect(toString(parseLine('2,0,5~2,2,5'))).toEqual('2,0,5~2,2,5');
    });
});

describe('settle', () => {
    it('calculates common reduction in z', () => {
        const result = settle(
            `1,0,2~1,2,2
            1,0,4~1,2,4
            1,0,5~1,2,5
            1,1,7~1,1,8`);

        expect(result.map(toString)).toEqual([
            '1,0,1~1,2,1',
            '1,0,2~1,2,2',
            '1,0,3~1,2,3',
            '1,1,4~1,1,5',
        ]);
    });

    it('works with many hops', () => {
        const result = settle(
            `1,0,1~2,0,1
            1,1,7~2,1,8`);

        expect(result.map(toString)).toEqual([
            '1,0,1~2,0,1',
            '1,1,1~2,1,2',
        ]);
    });

    it('works for complex example', () => {
        const result = settle(
            `1,0,1~1,2,1
            0,0,2~2,0,2
            0,2,3~2,2,3
            0,0,4~0,2,4
            2,0,5~2,2,5
            0,1,6~2,1,6
            1,1,8~1,1,9`);

        expect(result.map(toString)).toEqual([
            '1,0,1~1,2,1',
            '0,0,2~2,0,2',
            '0,2,2~2,2,2',
            '0,0,3~0,2,3',
            '2,0,3~2,2,3',
            '0,1,4~2,1,4',
            '1,1,5~1,1,6',
        ]);
    });
});

describe('countRemovals', () => {
    it('works as expected', () => {
        const input = settle(
            `1,0,1~1,2,1
            0,0,2~2,0,2
            0,2,3~2,2,3
            0,0,4~0,2,4
            2,0,5~2,2,5
            0,1,6~2,1,6
            1,1,8~1,1,9`);

        const result = countRemovals(input);

        expect(result).toEqual(5);
    });
});
