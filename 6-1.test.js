import {calculateDistances} from './6-1';

describe('calculateDistances', () => {
    it('returns all distances above required', () => {
        const result = calculateDistances(7, 9);

        expect(result).toHaveLength(4);
        expect(result).toEqual([10, 12, 12, 10]);
    });
});
