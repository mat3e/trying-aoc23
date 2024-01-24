export function solveMax(input) {
    const split = input.split('\n').map(line => line.trim());
    const startingPoints = [
        ...split[0].split('').map((_, x) => [DOWN, x, 0]),
        ...split[split.length - 1].split('').map((_, x) => [UP, x, split.length - 1]),
        ...split.map((_, y) => [RIGHT, 0, y]),
        ...split.map((_, y) => [LEFT, split[0].length - 1, y]),
    ];
    let max = Number.NEGATIVE_INFINITY;
    startingPoints.forEach((point) => {
        const result = solve(split, point);
        if (result > max) {
            max = result;
        }
    });
    return max;
}

const [RIGHT, DOWN, LEFT, UP] = ['R', 'D', 'L', 'U'];
const EMPTY = '.';
const SLASH_MIRROR = '/';
const BACKSLASH_MIRROR = '\\';
const VERTICAL_SPLITTER = '|';
const HORIZONTAL_SPLITTER = '-';

function solve(split, start) {
    const energizedEntries = new Set();
    const visited = new Set();
    const traverseStack = [start];
    while (traverseStack.length > 0) {
        const [direction, x, y] = traverseStack.pop();
        if (inSplit(split, x, y) && !visited.has(toVisited(direction, x, y))) {
            const char = split[y][x];
            energizedEntries.add(toEntry(x, y));
            visited.add(toVisited(direction, x, y));
            switch (char) {
                case EMPTY:
                    traverseStack.push(naturalNext(direction, x, y));
                    break;
                case SLASH_MIRROR:
                case BACKSLASH_MIRROR:
                    traverseStack.push(mirrorNext(direction, x, y, char));
                    break;
                case VERTICAL_SPLITTER:
                case HORIZONTAL_SPLITTER:
                    traverseStack.push(...splitterNext(direction, x, y, char));
                    break;
            }
        }
    }
    return energizedEntries.size;
}

const cache = new Map();

function withCache(key, value) {
    cache.set(key, value);
    return value;
}

export function dynamicSolve(split, point, visited = new Set()) {
    const [direction, x, y] = point;
    const visitSnapshot = toVisited(direction, x, y);
    if (cache.has(visitSnapshot)) {
        return cache.get(visitSnapshot);
    }
    if (!inSplit(split, x, y) || visited.has(visitSnapshot)) {
        return withCache(visitSnapshot, []);
    }
    const char = split[y][x];
    visited.add(visitSnapshot);
    const result = new Set([toEntry(x, y)]);
    switch (char) {
        case EMPTY:
            dynamicSolve(split, naturalNext(direction, x, y), visited).forEach(entry => result.add(entry));
            break;
        case SLASH_MIRROR:
        case BACKSLASH_MIRROR:
            dynamicSolve(split, mirrorNext(direction, x, y, char), visited).forEach(entry => result.add(entry));
            break;
        case VERTICAL_SPLITTER:
        case HORIZONTAL_SPLITTER:
            splitterNext(direction, x, y, char).forEach((point) => {
                dynamicSolve(split, point, visited).forEach(entry => result.add(entry));
            });
            break;
    }
    return withCache(visitSnapshot, result);
}

function toVisited(direction, x, y) {
    return `${direction},${toEntry(x, y)}`;
}

function toEntry(x, y) {
    return `${x},${y}`;
}

function naturalNext(direction, x, y) {
    switch (direction) {
        case RIGHT:
            return [RIGHT, x + 1, y];
        case DOWN:
            return [DOWN, x, y + 1];
        case LEFT:
            return [LEFT, x - 1, y];
        case UP:
            return [UP, x, y - 1];
    }
}

function mirrorNext(direction, x, y, mirror) {
    const upward = (direction === RIGHT && mirror === SLASH_MIRROR) || (direction === LEFT && mirror === BACKSLASH_MIRROR);
    const downward = (direction === LEFT && mirror === SLASH_MIRROR) || (direction === RIGHT && mirror === BACKSLASH_MIRROR);
    const leftward = (direction === DOWN && mirror === SLASH_MIRROR) || (direction === UP && mirror === BACKSLASH_MIRROR);
    const rightward = (direction === UP && mirror === SLASH_MIRROR) || (direction === DOWN && mirror === BACKSLASH_MIRROR);
    if (upward) {
        return [UP, x, y - 1];
    } else if (downward) {
        return [DOWN, x, y + 1];
    } else if (leftward) {
        return [LEFT, x - 1, y];
    } else if (rightward) {
        return [RIGHT, x + 1, y];
    }
}

function splitterNext(direction, x, y, splitter) {
    if (splitter === VERTICAL_SPLITTER) {
        switch (direction) {
            case RIGHT:
            case LEFT:
                return [[DOWN, x, y + 1], [UP, x, y - 1]];
            case DOWN:
                return [[DOWN, x, y + 1]];
            case UP:
                return [[UP, x, y - 1]];
        }
    }
    if (splitter === HORIZONTAL_SPLITTER) {
        switch (direction) {
            case RIGHT:
                return [[RIGHT, x + 1, y]];
            case LEFT:
                return [[LEFT, x - 1, y]];
            case DOWN:
            case UP:
                return [[RIGHT, x + 1, y], [LEFT, x - 1, y]];
        }
    }
}

function inSplit(split, x, y) {
    return y >= 0 && y < split.length && x >= 0 && x < split[y].length;
}

console.time();
console.log(solveMax(
    `input here`));
console.timeEnd();
