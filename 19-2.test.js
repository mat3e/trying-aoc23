import {countInRange, negate} from "./19-2.js";

describe('negate', () => {
    it('reverses all the conditions', () => {
        // when
        const result = negate(['a>1', 'b<2', 'c>3']);

        // then
        expect(result).toEqual(['a<2', 'b>1', 'c<4']);
    });
});

describe('countInRange', () => {
    it('returns numbers from 1 to 4000 matching the conditions', () => {
        expect(countInRange(['x>30', 'x>100'])).toBe(3900);
        expect(countInRange([])).toBe(4000);
        expect(countInRange(['x>100', 'x<3900'])).toBe(3799);
        expect(countInRange(['x>100', 'x<3900', 'x>300'])).toBe(3599);
        expect(countInRange(['x>100', 'x<10'])).toBe(0);
        expect(countInRange(['x>100', 'x<100'])).toBe(0);
        expect(countInRange(['x<10'])).toBe(9);
        expect(countInRange(['x>10'])).toBe(3990);
    });
});
