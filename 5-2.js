export function flow(inputText, maps) {
    const seeds = parseSeeds(inputText.split('\n')[0]);
    maps = (maps ?? parseMaps(inputText)).reverse();
    for (let location = 0; ; ++location) {
        let current = location;
        maps.forEach(map => {
            current = map.reverseGet(current);
        });
        if (seeds.contains(current)) {
            return location;
        }
    }
}

class Range {
    #start;
    #range;

    constructor(start, range) {
        this.#start = start;
        this.#range = range;
    }

    contains(candidate) {
        return this.#start <= candidate && candidate < this.#start + this.#range;
    }

    iterate(callback) {
        for (let i = 0; i < this.#range; ++i) {
            callback(this.#start + i);
        }
    }
}

class Ranges {
    #ranges = [];

    add(start, range) {
        this.#ranges.push(new Range(start, range));
    }

    contains(candidate) {
        return this.#ranges.some(range => range.contains(candidate));
    }

    iterate(callback) {
        for (let range of this.#ranges) {
            range.iterate(callback);
        }
    }

    findMinInEachRange(maps) {
        return Promise.all(this.#ranges.map(range => new Promise(resolve => {
            let min = Number.POSITIVE_INFINITY;
            range.iterate(candidate => {
                maps.forEach(map => {
                    candidate = map.get(candidate);
                });
                min = Math.min(min, candidate);
            });
            resolve(min);
        })));
    }
}

export function parseSeeds(inputLine) {
    const numbers = toNumbers(inputLine.replace('seeds: ', '').split(' '));
    const result = new Ranges();
    for (let i = 0; i < numbers.length; i += 2) {
        result.add(numbers[i], numbers[i + 1]);
    }
    return result;
}

class RangeMap {
    #source;
    #range;
    #destination;

    constructor(destination, source, range) {
        this.#destination = destination;
        this.#source = source;
        this.#range = range;
    }

    reverseGet(candidate) {
        const delta = candidate - this.#destination;
        if (candidate >= this.#destination && delta < this.#range) {
            return this.#source + delta;
        }
        return undefined;
    }

    get(candidate) {
        const delta = candidate - this.#source;
        if (candidate >= this.#source && delta < this.#range) {
            return this.#destination + delta;
        }
        return undefined;
    }
}

class RangeMaps {
    #ranges = [];

    set(destination, source, range) {
        this.#ranges.push(new RangeMap(destination, source, range));
    }

    reverseGet(candidate) {
        for (const range of this.#ranges) {
            const result = range.reverseGet(candidate);
            if (result) {
                return result;
            }
        }
        return candidate;
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
    for (let i = 1; i < input.length; i++) {
        if (input[i].includes('map:')) {
            maps.push(new RangeMaps());
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

const parsedMaps = parseMaps(`input here`);

async function asyncFlow(seeds, maps) {
    const mins = await seeds.findMinInEachRange(maps);
    return Math.min(...mins);
}

//const startTime = Date.now();
//console.info(flow(
//    'seeds: 4043382508 113348245 3817519559 177922221 3613573568 7600537 773371046 400582097 2054637767 162982133 2246524522 153824596 1662955672 121419555 2473628355 846370595 1830497666 190544464 230006436 483872831',
//    parsedMaps));
//console.log(`Took ${Date.now() - startTime}`);
/*asyncFlow(
    parseSeeds('seeds: 4043382508 113348245 3817519559 177922221 3613573568 7600537 773371046 400582097 2054637767 162982133 2246524522 153824596 1662955672 121419555 2473628355 846370595 1830497666 190544464 230006436 483872831'),
    parsedMaps
).then(min => {
    console.info(min);
    console.log(`Took ${Date.now() - startTime}`); // takes 18+ minutes
});*/
