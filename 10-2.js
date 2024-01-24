const validConnections = new Map([
    ['F', {
        left: new Set(),
        top: new Set(),
        right: new Set(['-', '7', 'J', 'S']),
        bottom: new Set(['|', 'J', 'L', 'S']),
    }],
    ['-', {
        left: new Set(['-', 'F', 'L', 'S']),
        top: new Set(),
        right: new Set(['-', '7', 'J', 'S']),
        bottom: new Set(),
    }],
    ['7', {
        left: new Set(['-', 'F', 'L', 'S']),
        top: new Set(),
        right: new Set(),
        bottom: new Set(['|', 'J', 'L', 'S']),
    }],
    ['|', {
        left: new Set(),
        top: new Set(['|', 'F', '7', 'S']),
        right: new Set(),
        bottom: new Set(['|', 'J', 'L', 'S']),
    }],
    ['L', {
        left: new Set(),
        top: new Set(['|', 'F', '7', 'S']),
        right: new Set(['-', '7', 'J', 'S']),
        bottom: new Set(),
    }],
    ['J', {
        left: new Set(['-', 'F', 'L', 'S']),
        top: new Set(['|', 'F', '7', 'S']),
        right: new Set(),
        bottom: new Set(),
    }],
    ['S', {
        left: new Set(['-', 'F', 'L']),
        top: new Set(['|', 'F', '7']),
        right: new Set(['-', '7', 'J']),
        bottom: new Set(['|', 'J', 'L']),
    }],
]);

const reversedDirections = new Map([
    ['left', 'right'],
    ['right', 'left'],
    ['top', 'bottom'],
    ['bottom', 'top'],
]);

export class Graph {
    /** @type {Map<string, string>} */
    #points = new Map();
    /** @type {Map<string, Set<string>>} */
    #matchingPipes = new Map();
    /** @type {Map<string, Set<string>>} */
    #adjacency = new Map();
    #sPoint = '';
    #height = NaN;
    #width = Number.NEGATIVE_INFINITY;
    #mainLoop = new Set();
    #input = '';

    constructor(input) {
        const lines = input.split('\n');
        this.#input = input;
        this.#height = lines.length - 1;
        lines.forEach((line, y) => {
            line = line.trim();
            for (let x = 0; x < line.length; x++) {
                const point = this.toPoint(x, y);
                const value = line[x];
                if (value === 'S') {
                    this.#sPoint = point;
                }
                this.#points.set(point, value);
                this.#matchingPipes.set(point, new Set());
                this.#adjacency.set(point, new Set());
                this.#connectNeighbors(x, y);
                this.#width = Math.max(this.#width, x);
            }
        });
        this.#mainLoop = this.#mainCycle();
    }

    inMainLoop(point) {
        return this.#mainLoop.has(point);
    }

    nonCycleNeighborsOf(point) {
        return [...this.#adjacency.get(point)].filter(neighbor => !this.#mainLoop.has(neighbor));
    }

    /**
     * @param {Set<string>} points
     * @type {Set<string>}
     */
    allButMainLoopAnd(points) {
        const result = new Set();
        this.#input.split('\n').forEach((line, y) => {
            line = line.trim();
            for (let x = 0; x < line.length; x++) {
                const point = this.toPoint(x, y);
                if (!this.#mainLoop.has(point) && !points.has(point)) {
                    result.add(point);
                }
            }
        });
        return result;
    }

    toPoint(x, y) {
        return `${x},${y}`;
    }

    fromPoint(point) {
        return point.split(',').map(Number);
    }

    get length() {
        return this.#mainLoop.size;
    }

    #connectNeighbors(x, y) {
        const {left, top, right, bottom} = this.#potentialNeighborsOf(x, y);
        const current = this.toPoint(x, y);
        const currentValue = this.#points.get(current);
        const [leftValue, topValue, rightValue, bottomValue] = [left, top, right, bottom].map(point => this.#points.get(point));
        if (leftValue) {
            this.#adjacency.get(current).add(left);
            this.#adjacency.get(left).add(current);
            if (this.#canConnect(currentValue, leftValue, 'left')) {
                this.#matchingPipes.get(current).add(left);
                this.#matchingPipes.get(left).add(current);
            }
        }
        if (topValue) {
            this.#adjacency.get(current).add(top);
            this.#adjacency.get(top).add(current);
            if (this.#canConnect(currentValue, topValue, 'top')) {
                this.#matchingPipes.get(current).add(top);
                this.#matchingPipes.get(top).add(current);
            }
        }
        if (rightValue) {
            this.#adjacency.get(current).add(right);
            this.#adjacency.get(right).add(current);
            if (this.#canConnect(currentValue, rightValue, 'right')) {
                this.#matchingPipes.get(current).add(right);
                this.#matchingPipes.get(right).add(current);
            }
        }
        if (bottomValue) {
            this.#adjacency.get(current).add(bottom);
            this.#adjacency.get(bottom).add(current);
            if (this.#canConnect(currentValue, bottomValue, 'bottom')) {
                this.#matchingPipes.get(current).add(bottom);
                this.#matchingPipes.get(bottom).add(current);
            }
        }
    }

    #potentialNeighborsOf(x, y) {
        return {
            left: this.toPoint(x - 1, y),
            top: this.toPoint(x, y - 1),
            right: this.toPoint(x + 1, y),
            bottom: this.toPoint(x, y + 1),
        };
    }

    #canConnect(value, potentialNeighborValue, direction) {
        return validConnections.has(value) &&
            validConnections.get(value)[direction].has(potentialNeighborValue) &&
            validConnections.get(potentialNeighborValue)[reversedDirections.get(direction)].has(value);
    }

    #mainCycle() {
        const visited = new Set();
        const queue = [this.#sPoint];
        while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current)) {
                continue;
            }
            visited.add(current);
            this.#cycleNeighborsOf(current).forEach(neighbor => queue.push(neighbor));
        }
        return visited;
    }

    #cycleNeighborsOf(current) {
        return [...this.#matchingPipes.get(current)].filter(point => this.#matchingPipes.get(point).size === 2)
    }
}

export function scaleUpTimes3(input) {
    const result = [];
    input.split('\n').forEach((line) => {
        line = line.trim();
        let row = '';
        let row2 = '';
        let row3 = '';
        for (let x = 0; x < line.length; x++) {
            const resizedValue = resizeTimes3(line[x]);
            row += resizedValue[0];
            row2 += resizedValue[1];
            row3 += resizedValue[2];
        }
        result.push(row, row2, row3);
    });
    return result.join('\n');
}

const defaultResizeTimes3 = [
    '...',
    '...',
    '...',
];
const resizedTimes3 = new Map([
    ['F', [
        '...',
        '.F-',
        '.|.',
    ]],
    ['-', [
        '...',
        '---',
        '...',
    ]],
    ['7', [
        '...',
        '-7.',
        '.|.',
    ]],
    ['|', [
        '.|.',
        '.|.',
        '.|.',
    ]],
    ['L', [
        '.|.',
        '.L-',
        '...',
    ]],
    ['J', [
        '.|.',
        '-J.',
        '...',
    ]],
    ['S', [
        '.|.',
        '-S-',
        '.|.',
    ]],
]);

function resizeTimes3(value) {
    return resizedTimes3.get(value) ?? defaultResizeTimes3;
}

export function enclosedPoints(input) {
    const originalGraph = new Graph(input);
    // prettyPrint(input, originalGraph);
    const graph = new Graph(scaleUpTimes3(input));
    const stack = [graph.toPoint(0, 0)];
    const floodFilled = new Set();
    while (stack.length > 0) {
        const current = stack.pop();
        if (floodFilled.has(current)) {
            continue;
        }
        floodFilled.add(current);
        stack.push(...graph.nonCycleNeighborsOf(current));
    }
    return [
        ...new Set(
            [...graph.allButMainLoopAnd(floodFilled)]
                .map(point => graph.fromPoint(point))
                .map(([x, y]) => graph.toPoint(x / 3 | 0, y / 3 | 0))
        )]
        .filter(point => !originalGraph.inMainLoop(point))
        .length;
}

const beautifyDict = new Map([
    ['F', '┌'],
    ['-', '─'],
    ['7', '┐'],
    ['|', '│'],
    ['L', '└'],
    ['J', '┘'],
    ['S', 'S'],
]);

function prettyPrint(input, graph = new Graph(input)) {
    input.split('\n').forEach((line, y) => {
        line = line.trim();
        const firstPoint = graph.toPoint(0, y);
        let previousInMain = graph.inMainLoop(firstPoint);
        let formattedText = '%c' + (previousInMain ? beautifyDict.get(line[0]) : line[0]);
        let formattingHints = [previousInMain ? 'color: green' : 'color: gray'];
        for (let x = 1; x < line.length; x++) {
            const value = line[x];
            const point = graph.toPoint(x, y);
            if (graph.inMainLoop(point)) {
                if (previousInMain) {
                    formattedText += beautifyDict.get(value);
                    continue;
                }
                formattedText += '%c' + beautifyDict.get(value);
                formattingHints.push('color: green');
                previousInMain = true;
                continue;
            }
            if (previousInMain) {
                formattedText += '%c' + value;
                formattingHints.push('color: gray');
                previousInMain = false;
                continue;
            }
            formattedText += value;
        }
        console.log(formattedText, ...formattingHints);
    });
}

prettyPrint(`FF7FSF7F7F7F7F7F---7
            L|LJ||||||||||||F--J
            FL-7LJLJ||||||LJL-77
            F--JF--7||LJLJ7F7FJ-
            L---JF-JLJ.||-FJLJJ7
            |F|F-JF---7F7-L7L|7|
            |FFJF7L7F-JF7|JL---7
            7-L-JL7||F7|L7F-7F7|
            L.L7LFJ|||||FJL7||LJ
            L7JLJL-JLJLJL--JLJ.L`);

// console.log(enclosedPoints(`input here`));
