import {leastCommonMultiple, parseInstructions, parseNodes, traverse} from './8-2';

describe('parseInstructions', () => {
    it('loops through instructions till needed', () => {
        const first = parseInstructions('RL');
        const second = parseInstructions('LLR');

        expect(first.next().value).toEqual(1);
        expect(second.next().value).toEqual(0);

        expect(first.next().value).toEqual(0);
        expect(second.next().value).toEqual(0);

        expect(first.next().value).toEqual(1);
        expect(second.next().value).toEqual(1);

        expect(first.next().value).toEqual(0);
        expect(second.next().value).toEqual(0);

        expect(first.next().value).toEqual(1);
        expect(second.next().value).toEqual(0);

        expect(first.next().value).toEqual(0);
        expect(second.next().value).toEqual(1);

        expect(first.next().value).toEqual(1);
        expect(second.next().value).toEqual(0);
    });
});

describe('parseNodes', () => {
    it('returns nodes with left and right neighbors', () => {
        const result = parseNodes(
            'AAA = (BBB, CCC)',
            'BBB = (DDD, EEE)',
            'CCC = (ZZZ, GGG)',
            'DDD = (DDD, DDD)',
            'EEE = (EEE, EEE)',
            'GGG = (GGG, GGG)',
            'ZZZ = (ZZZ, ZZZ)');

        expect(result).toEqual({
            AAA: ['BBB', 'CCC'],
            BBB: ['DDD', 'EEE'],
            CCC: ['ZZZ', 'GGG'],
            DDD: ['DDD', 'DDD'],
            EEE: ['EEE', 'EEE'],
            GGG: ['GGG', 'GGG'],
            ZZZ: ['ZZZ', 'ZZZ'],
        });
    });
});

describe('traverse', () => {
    it('returns required number of steps from parallel *A to *Z', () => {
        expect(traverse(
            `LR

            11A = (11B, XXX)
            11B = (XXX, 11Z)
            11Z = (11B, XXX)
            22A = (22B, XXX)
            22B = (22C, 22C)
            22C = (22Z, 22Z)
            22Z = (22B, 22B)
            XXX = (XXX, XXX)`)).toEqual(6);
    });
});

describe('leastCommonMultiple', () => {
    it.each([
        [[42, 56], 168],
        [[192, 348], 5568],
        [[4, 6, 8], 24],
        [[8, 9, 21], 504],
    ])('finds appropriate number', (numbers, expected) => {
        expect(leastCommonMultiple(...numbers)).toEqual(expected);
    });
});
