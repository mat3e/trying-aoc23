import {flow, parseMaps, parseSeeds} from "./5-1.js";

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
    it('lists seeds to be planted', () => {
        expect(parseSeeds(input.split('\n')[0])).toEqual([79, 14, 55, 13])
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
    it('finds all locations', () => {
        expect(flow(input)).toEqual([82, 43, 86, 35]);
    });
});

describe('find lowest', () => {
    it('works with sorting', () => {
        expect([
            554772016,
            2329359560,
            289863851,
            3925744835,
            3583276072,
            3202942784,
            3370639513,
            1135950578,
            2271060962,
            3358273613,
            4021704425,
            2164111232,
            339856872,
            2337430870,
            3024209626,
            1992371317,
            1778333078,
            3938367078,
            3110811817,
            3075772571
        ].sort((a, b) => a - b)[0]).toBe(289863851);
    });
});
