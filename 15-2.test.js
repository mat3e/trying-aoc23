import {calculateBoxFocusingPower, divideIntoBoxes} from './15-2';

describe('calculateBoxFocusingPower', () => {
    it('multiplies focal length by lens and box numbers (counting from 1)', () => {
        expect(calculateBoxFocusingPower(3, new Map([['ot', 7], ['ab', 5], ['pc', 6]]))).toBe(28 + 40 + 72);
    });
});

describe('divideIntoBoxes', () => {
    it('return boxes with proper content', () => {
        expect(divideIntoBoxes('rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'))
            .toEqual(new Map([
                [0, new Map([['rn', 1], ['cm', 2]])],
                [1, new Map()],
                [3, new Map([['ot', 7], ['ab', 5], ['pc', 6]])],
            ]));
    });
});
