import {calculate, iterator, parseLine} from "./4-2";

describe('calculate', () => {
    it.each([
        [[31, 18, 13, 56, 72], [74, 77, 10, 23, 35, 67, 36, 11]],
        [[87, 83, 26, 28, 32], [88, 30, 70, 12, 93, 22, 82, 36]],
    ])('returns 0 if no match', (winningNumbers, numbersGot) => {
        expect(calculate(winningNumbers, numbersGot)).toBe(0);
    });

    it('returns 1 for a single match', () => {
        expect(calculate([41, 92, 73, 84, 69], [59, 84, 76, 51, 58, 5, 54, 83])).toBe(1);
    });

    it.each([
        [[13, 32, 20, 16, 61], [61, 30, 68, 82, 17, 32, 24, 19]],
        [[1, 21, 53, 59, 44], [69, 82, 63, 72, 16, 21, 14, 1]],
    ])('returns 2 for 2 matches', (winningNumbers, numbersGot) => {
        expect(calculate(winningNumbers, numbersGot)).toBe(2);
    });

    it('returns the number of matches', () => {
        expect(calculate([41, 48, 83, 86, 17], [83, 86, 6, 31, 17, 9, 48, 53])).toBe(4);
    });
});

describe('parseLine', () => {
    it('translates to 2 arrays - card number and winning/got', () => {
        const [card, [first, second]] = parseLine('Card   11: 41 48 83 86 17 | 83 86  6 31 17  9 48 53');
        expect(card).toBe(11);
        expect(first).toEqual([41, 48, 83, 86, 17]);
        expect(second).toEqual([83, 86, 6, 31, 17, 9, 48, 53]);
    });
});

describe('iterator', () => {
    it('moves to next state - easy scenario', () => {
        // given
        const toTest = iterator(
            `Card 172: 92  9 73 82 15  6 44 28 88 34 | 99 78 11 46  9 36 89 65 17  8 16 94 68 63 12 54 25 33 69 47 13 38 93 50 59
             Card 173: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`);

        expect(toTest.state).toEqual(new Map([[172, 1], [173, 1]]));

        // when
        toTest.next();

        // then
        expect(toTest.state).toEqual(new Map([[172, 1], [173, 2]]));
        expect(toTest.hasNext()).toBe(true);

        // when
        toTest.next();

        // then
        expect(toTest.state).toEqual(new Map([[172, 1], [173, 2]]));
        expect(toTest.hasNext()).toBe(false);

        // no throw
        toTest.next();
    });

    it('works as in example', () => {
        // given
        const toTest = iterator(
            `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
            Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
            Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
            Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
            Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
            Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`);

        expect(toTest.state).toEqual(new Map([
            [1, 1],
            [2, 1],
            [3, 1],
            [4, 1],
            [5, 1],
            [6, 1],
        ]));

        // when
        toTest.next();

        // then
        expect(toTest.state).toEqual(new Map([
            [1, 1],
            [2, 2],
            [3, 2],
            [4, 2],
            [5, 2],
            [6, 1],
        ]));

        // when
        toTest.next();

        // then
        expect(toTest.state).toEqual(new Map([
            [1, 1],
            [2, 2],
            [3, 4],
            [4, 4],
            [5, 2],
            [6, 1],
        ]));

        // when
        toTest.next();

        // then
        expect(toTest.state).toEqual(new Map([
            [1, 1],
            [2, 2],
            [3, 4],
            [4, 8],
            [5, 6],
            [6, 1],
        ]));

        // when
        toTest.next();

        // then
        expect(toTest.state).toEqual(new Map([
            [1, 1],
            [2, 2],
            [3, 4],
            [4, 8],
            [5, 14],
            [6, 1],
        ]));

        // when
        while (toTest.hasNext()) {
            toTest.next();
        }

        // then
        expect(toTest.state).toEqual(new Map([
            [1, 1],
            [2, 2],
            [3, 4],
            [4, 8],
            [5, 14],
            [6, 1],
        ]));
    });
});
