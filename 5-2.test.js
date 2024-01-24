import {flow, parseMaps, parseSeeds} from "./5-2.js";

const input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

describe('first line input', () => {
    it('lists seeds to be planted in ranges', () => {
        // given
        const firstRange = [...Array(14).keys()].map(i => 79 + i);
        const secondRange = [...Array(13).keys()].map(i => 55 + i);

        // when
        const result = [];
        parseSeeds(input.split('\n')[0]).iterate(seed => result.push(seed));

        expect(result).toEqual([...firstRange, ...secondRange]);
    });
});

describe('splitting to maps', () => {
    it('results in 7 maps', () => {
        const result = parseMaps(input);

        expect(result).toHaveLength(7);
        expect(result[0].get(98)).toEqual(50);
        expect(result[0].get(99)).toEqual(51);
        expect(result[0].get(0)).toEqual(0);
        expect(result[0].get(53)).toEqual(55);
    });
});

describe('full flow', () => {
    it('finds smallest location', () => {
        expect(flow(input)).toBe(46);
    });

    it('can run from precomputed maps', () => {
        expect(flow(input.split('\n')[0], parseMaps(input))).toBe(46);
    });
});
