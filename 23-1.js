export class Graph {
    #nodes = new Map();
    #edges = new Map();
    #adj = new Map();

    constructor(input) {
        const lines = input.split('\n').map(line => line.trim());
        let current = new Point(1, 0, lines[0][1]);
        this.#parseEdges(current, lines);
    }

    get longestPath() {
        const startId = Point.id(1, 0);
        const distances = new Map([
            [startId, 0]
        ]);
        const order = this.#topologicalOrder;
        while (order.length) {
            const currentId = order.pop();
            if (distances.has(currentId)) {
                this.#adj.get(currentId)?.forEach((neighbor) => {
                    const distance = distances.get(currentId) + this.#edges.get(this.#edgeName(currentId, neighbor.id)) ?? 1;
                    if (!distances.has(neighbor.id) || distances.get(neighbor.id) < distance) {
                        distances.set(neighbor.id, distance);
                    }
                });
            }
        }
        return Math.max(...distances.values());
    }

    #parseEdges(currentPoint, lines, candidate = null) {
        const first = currentPoint;
        this.#nodes.set(currentPoint.id, currentPoint);
        if (!this.#adj.has(currentPoint.id)) {
            this.#adj.set(currentPoint.id, new Set());
        }
        let edgeNodes = new Set([currentPoint.id]);
        let currentDirection = Direction.from(currentPoint.value);
        let candidates = this.#findCandidatesFor(edgeNodes, currentPoint, lines);
        let validEdge = true;
        while (candidates.length === 1 || candidate) {
            currentPoint = candidate ?? candidates[0];
            candidate = null;
            if (currentDirection.collidesWith(currentPoint.value)) {
                validEdge = false;
                break;
            }
            currentDirection = currentDirection.updateFrom(currentPoint.value);
            edgeNodes.add(currentPoint.id);
            candidates = this.#findCandidatesFor(edgeNodes, currentPoint, lines);
        }
        if (validEdge) {
            this.#nodes.set(currentPoint.id, currentPoint);
            this.#adj.get(first.id).add(currentPoint);
            const nodesArray = [...edgeNodes];
            this.#edges.set(this.#edgeName(nodesArray[0], nodesArray[nodesArray.length - 1]), nodesArray.length - 1);
            if (candidates.length > 1) {
                // choose only outgoing candidates
                candidates = candidates.filter(({x, y, value}) => {
                    if (currentPoint.x < x) {
                        return value === '>' || value === '.';
                    }
                    if (currentPoint.x > x) {
                        return value === '<' || value === '.';
                    }
                    if (currentPoint.y < y) {
                        return value === 'v' || value === '.';
                    }
                    if (currentPoint.y > y) {
                        return value === '^' || value === '.';
                    }
                });
                for (let i = 0; i < candidates.length; i++) {
                    this.#parseEdges(currentPoint, lines, candidates[i]);
                }
            }
        }
    }

    #edgeName(from, to) {
        return `${from}-${to}`;
    }

    #findCandidatesFor(nodesSoFar, point, lines) {
        return point.potentialNeighbors
            .filter(([x, y]) => ((lines[y] ?? [])[x] ?? '#') !== '#')
            .map(([x, y]) => new Point(x, y, lines[y][x]))
            .filter(candidate => !nodesSoFar.has(candidate.id));
    }

    get #topologicalOrder() {
        const stack = [];
        const visited = new Set();
        this.#nodes.forEach((_, id) => this.#topologicalSort(id, visited, stack));
        return stack; // no reversing, so pop() works when iterating
    }

    #topologicalSort(id, visited, stack) {
        if (visited.has(id)) {
            return;
        }
        visited.add(id);
        this.#adj.get(id)?.forEach((neighbor) => this.#topologicalSort(neighbor.id, visited, stack));
        stack.push(id);
    }
}

class Direction {
    static NOOP = new Direction();

    static from(symbol) {
        switch (symbol) {
            case '^':
                return new Up();
            case 'v':
                return new Down();
            case '>':
                return new Right();
            case '<':
                return new Left();
            default:
                return Direction.NOOP;
        }
    }

    updateFrom(symbol) {
        if (!this.collidesWith(symbol) && symbol !== '.') {
            return Direction.from(symbol);
        }
        return this;
    }

    collidesWith(otherSymbol) {
        return false;
    }
}

class Up extends Direction {
    collidesWith(otherSymbol) {
        return otherSymbol === 'v';
    }
}

class Down extends Direction {
    collidesWith(otherSymbol) {
        return otherSymbol === '^';
    }
}

class Left extends Direction {
    collidesWith(otherSymbol) {
        return otherSymbol === '>';
    }
}

class Right extends Direction {
    collidesWith(otherSymbol) {
        return otherSymbol === '<';
    }
}

class Point {
    static id(x, y) {
        return `${x},${y}`;
    }

    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    }

    get id() {
        return Point.id(this.x, this.y);
    }

    get potentialNeighbors() {
        return [
            [this.x - 1, this.y],
            [this.x + 1, this.y],
            [this.x, this.y - 1],
            [this.x, this.y + 1],
        ];
    }
}

console.log(new Graph(
    `input here`
).longestPath);
