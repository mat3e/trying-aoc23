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

// sanity check
/*validConnections.forEach((value, key) => {
    Object.entries(value).forEach(([direction, connection]) => {
        if (connection.size === 0) {
            return;
        }
        const reverseDirection = reversedDirections.get(direction);
        let result = '';
        connection.forEach((other) => {
            if (!validConnections.get(other)[reverseDirection].has(key)) {
                result += `'${key}' connects to '${other}' from ${direction}, so '${other}' must connect to '${key}' from ${reverseDirection}\n`;
            }
        });
        console.log(result);
    });
});*/

export class Graph {
    /** @type {Map<string, string>} */
    #points = new Map();
    /** @type {Map<string, Set<string>>} */
    #adjacency = new Map();
    #sPoint = '';

    constructor(input) {
        input.split('\n').forEach((line, y) => {
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
            }
        });
    }

    get length() {
        if (!this.#sPoint) {
            return [...this.#adjacency.values()].filter(neighbors => neighbors.size === 2).length;
        }
        return this.#traverse()[0].size;
    }

    get maxDistance() {
        return [...this.#traverse()[1].values()].sort((a, b) => b - a)[0];
    }

    #traverse() {
        const visited = new Set();
        const queue = [this.#sPoint];
        const distance = new Map([
            [this.#sPoint, 0],
        ]);
        while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current)) {
                continue;
            }
            visited.add(current);
            this.#adjacency.get(current).forEach(neighbor => {
                queue.push(neighbor);
                if (!distance.has(neighbor)) {
                    distance.set(neighbor, distance.get(current) + 1);
                }
            });
        }
        return [visited, distance];
    }

    #toPoint(x, y) {
        return `${x},${y}`;
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

/*console.log(new Graph(
`input here`
).maxDistance);*/
