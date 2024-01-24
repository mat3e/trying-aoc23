import {occursInTestArea} from './24-1';

describe('occursInTestArea', () => {
    it.each([
        ['19, 13, 30 @ -2, 1, -2', '18, 19, 22 @ -1, -1, -2'],
        ['19, 13, 30 @ -2, 1, -2', '20, 25, 34 @ -2, -2, -4'],
    ])('finds when intersect inside the area (%s ~ %s)', (first, second) => {
        expect(occursInTestArea(first, second, 7, 27)).toBe(true);
    });

    it.each([
        ['19, 13, 30 @ -2, 1, -2', '12, 31, 28 @ -1, -2, -1'],
        ['18, 19, 22 @ -1, -1, -2', '12, 31, 28 @ -1, -2, -1'],
        ['20, 25, 34 @ -2, -2, -4', '12, 31, 28 @ -1, -2, -1'],
    ])('finds when intersect outside the area (%s ~ %s)', (first, second) => {
        expect(occursInTestArea(first, second, 7, 27)).toBe(false);
    });

    it.each([
        ['19, 13, 30 @ -2, 1, -2', '20, 19, 15 @ 1, -5, -3'],
        ['20, 25, 34 @ -2, -2, -4', '20, 19, 15 @ 1, -5, -3'],
    ])('finds when one intersect in the past (%s ~ %s)', (first, second) => {
        expect(occursInTestArea(first, second, 7, 27)).toBe(false);
    });

    it.each([
        ['18, 19, 22 @ -1, -1, -2', '20, 19, 15 @ 1, -5, -3'],
        ['12, 31, 28 @ -1, -2, -1', '20, 19, 15 @ 1, -5, -3'],
    ])('finds when both intersect in the past (%s ~ %s)', (first, second) => {
        expect(occursInTestArea(first, second, 7, 27)).toBe(false);
    });

    it('finds when paths parallel', () => {
        expect(occursInTestArea('18, 19, 22 @ -1, -1, -2', '20, 25, 34 @ -2, -2, -4', 7, 27)).toBe(false);
    });
});
