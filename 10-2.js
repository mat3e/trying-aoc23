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

const beautifyDict = new Map([
    ['F', '┌'],
    ['-', '─'],
    ['7', '┐'],
    ['|', '│'],
    ['L', '└'],
    ['J', '┘'],
    ['S', 'S'],
]);

export class Graph {
    /** @type {Map<string, string>} */
    #points = new Map();
    /** @type {Map<string, Set<string>>} */
    #adjacency = new Map();
    #sPoint = '';
    #height = NaN;
    #width = Number.NEGATIVE_INFINITY;
    #mainLoop = new Set();
    #capturedInput = '';

    constructor(input, pp = false) {
        if (pp) {
            this.#capturedInput = input;
        }
        const lines = input.split('\n');
        this.#height = lines.length - 1;
        lines.forEach((line, y) => {
            line = line.trim();
            for (let x = 0; x < line.length; x++) {
                const value = line[x];
                if (!validConnections.has(value)) {
                    continue;
                }
                const point = this.#toPoint(x, y);
                if (value === 'S') {
                    this.#sPoint = point;
                }
                this.#points.set(point, value);
                this.#adjacency.set(point, new Set());
                this.#connectNeighbors(x, y);
                this.#width = Math.max(this.#width, x);
            }
        });
        this.#mainLoop = this.#traverseFrom(this.#sPoint);
    }

    get enclosed() {
        const escapePoints = this.#escapePoints();
        const enclosedPoints = new Set();
        for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {
                const point = this.#toPoint(x, y);
                if (this.#mainLoop.has(point) || escapePoints.has(point) || enclosedPoints.has(point)) {
                    continue;
                }
                const traversed = [...this.#traverseFrom(point, (current) => {
                    const {left, top, right, bottom} = this.#neighborsOf(...this.#fromPoint(current));
                    return new Set([left, top, right, bottom]
                        .filter(point => !this.#mainLoop.has(point))
                        .map(point => this.#fromPoint(point))
                        .filter(([x, y]) => x >= 0 && x <= this.#width && y >= 0 && y <= this.#height)
                        .map(([x, y]) => this.#toPoint(x, y)));
                })];
                if (traversed.some(point => escapePoints.has(point))) {
                    continue;
                }
                traversed
                    .forEach(point => enclosedPoints.add(point));
            }
        }
        return enclosedPoints.size;
    }

    prettyPrint() {
        if (!this.#capturedInput) {
            return;
        }
        this.#capturedInput.split('\n').forEach((line, y) => {
            line = line.trim();
            const firstPoint = this.#toPoint(0, y);
            let previousInMain = this.#mainLoop.has(firstPoint);
            let formattedText = '%c' + (previousInMain ? beautifyDict.get(line[0]) : line[0]);
            let formattingHints = [previousInMain ? 'color: green' : 'color: gray'];
            for (let x = 1; x < line.length; x++) {
                const value = line[x];
                const point = this.#toPoint(x, y);
                if (this.#mainLoop.has(point)) {
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
    #escapePoints() {
        const escapePoints = new Set();
        for (let x = 0; x <= this.#width; x++) {
            const firstCandidate = this.#toPoint(x, 0);
            const secondCandidate = this.#toPoint(x, this.#height);
            if (!this.#mainLoop.has(firstCandidate)) {
                escapePoints.add(firstCandidate);
            }
            if (!this.#mainLoop.has(secondCandidate)) {
                escapePoints.add(secondCandidate);
            }
        }
        for (let y = 0; y <= this.#height; y++) {
            const firstCandidate = this.#toPoint(0, y);
            const secondCandidate = this.#toPoint(this.#width, y);
            if (!this.#mainLoop.has(firstCandidate)) {
                escapePoints.add(firstCandidate);
            }
            if (!this.#mainLoop.has(secondCandidate)) {
                escapePoints.add(secondCandidate);
            }
        }
        return escapePoints;
    }

    #traverseFrom(point, findNeighbors = current => this.#adjacency.get(current)) {
        const visited = new Set();
        const queue = [point];
        while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current)) {
                continue;
            }
            visited.add(current);
            findNeighbors(current).forEach(neighbor => queue.push(neighbor));
        }
        return visited;
    }

    #toPoint(x, y) {
        return `${x},${y}`;
    }

    #fromPoint(txt) {
        return txt.split(',').map(Number);
    }

    #connectNeighbors(x, y) {
        const {left, top, right, bottom} = this.#neighborsOf(x, y);
        const current = this.#toPoint(x, y);
        const currentValue = this.#points.get(current);
        const [leftValue, topValue, rightValue, bottomValue] = [left, top, right, bottom].map(point => this.#points.get(point));
        if (this.#canConnect(currentValue, leftValue, 'left')) {
            this.#adjacency.get(current).add(left);
            this.#adjacency.get(left).add(current);
        }
        if (this.#canConnect(currentValue, topValue, 'top')) {
            this.#adjacency.get(current).add(top);
            this.#adjacency.get(top).add(current);
        }
        if (this.#canConnect(currentValue, rightValue, 'right')) {
            this.#adjacency.get(current).add(right);
            this.#adjacency.get(right).add(current);
        }
        if (this.#canConnect(currentValue, bottomValue, 'bottom')) {
            this.#adjacency.get(current).add(bottom);
            this.#adjacency.get(bottom).add(current);
        }
    }

    #neighborsOf(x, y) {
        return {
            left: this.#toPoint(x - 1, y),
            top: this.#toPoint(x, y - 1),
            right: this.#toPoint(x + 1, y),
            bottom: this.#toPoint(x, y + 1),
        };
    }

    #canConnect(value, potentialNeighborValue, direction) {
        return validConnections.get(value)[direction].has(potentialNeighborValue) &&
            validConnections.get(potentialNeighborValue)[reversedDirections.get(direction)].has(value);
    }
}

new Graph(
    `FF7FSF7F7F7F7F7F---7
    L|LJ||||||||||||F--J
    FL-7LJLJ||||||LJL-77
    F--JF--7||LJLJ7F7FJ-
    L---JF-JLJ.||-FJLJJ7
    |F|F-JF---7F7-L7L|7|
    |FFJF7L7F-JF7|JL---7
    7-L-JL7||F7|L7F-7F7|
    L.L7LFJ|||||FJL7||LJ
    L7JLJL-JLJLJL--JLJ.L`,
    true
).prettyPrint();

new Graph(
    `........
    .S----7.
    .|F--7|.
    .||OOLJ.
    .||OOF7.
    .|L--J|.
    .|IIII|.
    .L----J.
    ........`,
    true
).prettyPrint();

new Graph(
    `..........
    .S------7.
    .|F----7|.
    .||OOOO||.
    .|L-7F-J|.
    .|II||II|.
    .L--JL--J.
    ..........`,
    true
).prettyPrint();

new Graph(
    `..........
    .S------7.
    .|F----7|.
    .||OOOO||.
    .|L-7F-J|.
    .|II||F7|.
    .L--JLJLJ.
    ..........`,
    true
).prettyPrint();
