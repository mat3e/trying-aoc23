export function flow(inputText) {
    const seeds = parseSeeds(inputText.split('\n')[0]);
    const maps = parseMaps(inputText);
    const result = [];
    seeds.forEach(seed => {
        let current = seed;
        maps.forEach(map => {
            current = map.get(current);
        });
        result.push(current);
    });
    return result;
}

export function parseSeeds(inputLine) {
    return toNumbers(inputLine.replace('seeds: ', '').split(' '));
}

class Range {
    #source;
    #range;
    #destination;

    constructor(destination, source, range) {
        this.#destination = destination;
        this.#source = source;
        this.#range = range;
    }

    get(candidate) {
        const delta = candidate - this.#source;
        if (candidate >= this.#source && delta < this.#range) {
            return this.#destination + delta;
        }
        return undefined;
    }
}

class Ranges {
    #ranges = [];

    set(destination, source, range) {
        this.#ranges.push(new Range(destination, source, range));
    }

    get(candidate) {
        for (const range of this.#ranges) {
            const result = range.get(candidate);
            if (result) {
                return result;
            }
        }
        return candidate;
    }
}

export function parseMaps(inputText) {
    const input = inputText.split('\n');
    const maps = [];
    for (let i = 2; i < input.length; i++) {
        if (input[i].includes('map:')) {
            maps.push(new Ranges());
            continue;
        }
        if (input[i].trim().length > 0) {
            maps[maps.length - 1].set(...toNumbers(input[i].split(' ')));
        }
    }
    return maps;
}

function toNumbers(strings) {
    return strings
        .map(num => num.trim())
        .filter(num => num.length > 0)
        .map(num => +num);
}

console.info(flow(`input here`).sort((a, b) => a - b)[0]);
