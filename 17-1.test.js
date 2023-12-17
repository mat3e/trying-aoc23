import {dijkstraSolve, CrucibleState, DOWN, LEFT, RIGHT, UP} from './17-1';

test('dijkstraSolve', () => {
    expect(dijkstraSolve(
        `2413432311323
        3215453535623
        3255245654254
        3446585845452
        4546657867536
        1438598798454
        4457876987766
        3637877979653
        4654967986887
        4564679986453
        1224686865563
        2546548887735
        4322674655533`)).toBe(102);
});

describe('CrucibleState', () => {
    const {arrayContaining} = expect;
    it('can move at most three blocks in a single direction before it must turn 90 degrees left or right', () => {
        // given
        let toTest = new CrucibleState(2, 2, DOWN, 0);
        const pointsToChooseFrom = [[2, 3], [2, 4], [2, 5], [2, 6]];

        // when
        let chosen = toTest.chooseAvailable(pointsToChooseFrom);

        // then
        expect(chosen).toHaveLength(1);
        expect(chosen.map(c => c.toPoint())).toContain('2,3');
        expect(pointsToChooseFrom).toHaveLength(3);
        expect(pointsToChooseFrom).toEqual(arrayContaining([[2, 4], [2, 5], [2, 6]]));

        // when
        chosen = chosen[0].chooseAvailable(pointsToChooseFrom);
        chosen = chosen[0].chooseAvailable(pointsToChooseFrom);

        // then
        expect(chosen.map(c => c.toPoint())).toContain('2,5');
        expect(pointsToChooseFrom).toEqual([[2, 6]]);

        // when
        toTest = chosen[0];
        chosen = toTest.chooseAvailable(pointsToChooseFrom);

        // then
        expect(chosen).toHaveLength(0);
        expect(pointsToChooseFrom).toEqual([[2, 6]]);

        // when
        pointsToChooseFrom.push([1, 5], [3, 5]);
        chosen = toTest.chooseAvailable(pointsToChooseFrom);

        // then
        expect(chosen).toHaveLength(2);
        expect(chosen.map(c => c.toPoint())).toContain('1,5');
        expect(chosen.map(c => c.toPoint())).toContain('3,5');
        expect(pointsToChooseFrom).toEqual([[2, 6]]);
    });

    it.each([
        [DOWN, [[2, 3], [1, 2], [3, 2]]],
        [UP, [[2, 1], [1, 2], [3, 2]]],
        [RIGHT, [[3, 2], [2, 3], [2, 1]]],
        [LEFT, [[1, 2], [2, 3], [2, 1]]],
    ])('may only turn left, continue straight, or turn right', (direction, expected) => {
        // given
        const toTest = new CrucibleState(2, 2, direction);

        // when
        const result = toTest.potentialMoves;

        // then
        expect(result).toEqual(arrayContaining(expected));
    });
});
