import {parseInstructions, parseNodes, traverse} from './8-1';

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
    it('returns required number of steps from AAA to ZZZ', () => {
        expect(traverse(
            `RL
            
            AAA = (BBB, CCC)
            BBB = (DDD, EEE)
            CCC = (ZZZ, GGG)
            DDD = (DDD, DDD)
            EEE = (EEE, EEE)
            GGG = (GGG, GGG)
            ZZZ = (ZZZ, ZZZ)`)).toEqual(2);
    });
});
