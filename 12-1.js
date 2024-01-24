const cache = new Map([
    ['# 1', 1],
    ['## 2', 1],
]);

/**
 * @param {string} pattern
 * @param {number} sizes
 */
export function countMatches(pattern, ...sizes) {
    const toCheck = `${pattern} ${sizes}`;
    if (cache.has(toCheck)) {
        return cache.get(toCheck);
    }
    if (sizes.length === 0) {
        return withCaching(pattern.includes('#') ? 0 : 1, toCheck);
    }
    // sizes.length-1 as we need so many '.' to separate the groups in pattern
    if (pattern.length < sizes.reduce((sum, current) => sum + current, 0) + sizes.length - 1) {
        return withCaching(0, toCheck);
    }
    if (pattern[0] === '.') {
        return withCaching(countMatches(pattern.slice(1), ...sizes), toCheck);
    }
    if (pattern[0] === '#') {
        const [currentSize, ...remainingSizes] = sizes;
        for (let i = 1; i < currentSize; i++) {
            if (pattern[i] === '.') {
                return withCaching(0, toCheck);
            }
        }
        if (pattern[currentSize] === '#') {
            return withCaching(0, toCheck);
        }
        // currentSize+1 as we need '.' to separate from next groups in pattern
        return withCaching(countMatches(pattern.slice(currentSize + 1), ...remainingSizes), toCheck);
    }
    return withCaching(
        countMatches(pattern.slice(1), ...sizes) + countMatches('#' + pattern.slice(1), ...sizes),
        toCheck
    );
}

function withCaching(result, cacheKey) {
    cache.set(cacheKey, result);
    return result;
}

export function countAllArrangements(input) {
    let result = 0;
    input.split('\n').map(line => line.trim().split(' ')).forEach(([pattern, sizesPart]) => {
        const sizes = sizesPart.split(',').map(Number);
        result += countMatches(pattern, ...sizes);
    });
    return result;
}

/*console.time();
console.log(countAllArrangements(
    `input here`));
console.timeEnd();*/
