import {countFallingOnes, settle} from './22-2';
import {toString} from "./22-1.js";

describe('countFallingOnes', () => {
    it('works as expected', () => {
        const input = settle(
            `1,0,1~1,2,1
            0,0,2~2,0,2
            0,2,3~2,2,3
            0,0,4~0,2,4
            2,0,5~2,2,5
            0,1,6~2,1,6
            1,1,8~1,1,9`);

        const result = countFallingOnes(input);

        expect(result).toEqual(7);
    });
});

describe('settle', () => {
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
