const GALAXY = '#';

export function expand(input) {
    const lines = input.split('\n').map(line => line.trim());
    const rowsToExpand = new Set();
    const columnsNotToExpand = new Set();
    lines.forEach((line, y) => {
        line = line.trim();
        if (!line.includes(GALAXY)) {
            rowsToExpand.add(y);
        }
        for (let x = 0; x < line.length; x++) {
            if (line[x] === GALAXY) {
                columnsNotToExpand.add(x);
            }
        }
    });
    const columnsToExpand = new Set([...Array(lines[0].length).keys()].filter(column => !columnsNotToExpand.has(column)));
    return [lines, rowsToExpand, columnsToExpand];
}

export function sumGalaxiesPaths(input, weight) {
    const [lines, rows, columns] = expand(input);
    const graph = new GalaxiesGraph(lines, rows, columns, weight);
    let sum = 0;
    graph.galaxies.forEach(galaxy => {
        graph.dijkstraBetweenGalaxies(galaxy, (distanceToOtherGalaxy) => {
            sum += distanceToOtherGalaxy;
        });
    });
    return sum / 2;
}

class GalaxiesGraph {
    #galaxies = new Set();
    #adjacency = new Map();
    #edges = new Map();

    constructor(inputArray, rowsToExpand, columnsToExpand, weight = 2) {
        inputArray.forEach((line, y) => {
            for (let x = 0; x < line.length; x++) {
                const value = line[x];
                const point = new Point(x, y);
                if (value === GALAXY) {
                    this.#galaxies.add(point.text);
                }
                this.#adjacency.set(point.text, new Set());
                this.#connect(point, rowsToExpand, columnsToExpand, weight);
            }
        });
    }

    get galaxies() {
        return [...this.#galaxies];
    }

    dijkstraBetweenGalaxies(start, galaxyPathFoundCallback, optionalEnd) {
        if (!this.#galaxies.has(start)) {
            throw new Error('Not a galaxy');
        }
        const queue = new BinaryHeap();
        const pathToOtherGalaxies = new Map();
        const dist = new Map();
        dist.set(start, 0);
        queue.push(start, 0);
        while (queue.length > 0) {
            const currentPoint = queue.pop();
            if (this.#galaxies.has(currentPoint) && currentPoint !== start && (!optionalEnd || currentPoint === optionalEnd)) {
                galaxyPathFoundCallback(dist.get(currentPoint));
                if (optionalEnd) {
                    return;
                }
            }
            this.#adjacency.get(currentPoint).forEach((neighbor) => {
                const potentialDistance = dist.get(currentPoint) + this.#weight(currentPoint, neighbor);
                if (!dist.has(neighbor) || potentialDistance < dist.get(neighbor)) {
                    dist.set(neighbor, potentialDistance);
                    pathToOtherGalaxies.set(neighbor, currentPoint);
                    if (queue.has(neighbor)) {
                        queue.update(neighbor, potentialDistance);
                    } else {
                        queue.push(neighbor, potentialDistance);
                    }
                }
            });
        }
    }

    #connect(point, rowsToExpand, columnsToExpand, additionalWeight) {
        point.potentialPreviousNeighbors
            .forEach((neighbor) => {
                if (!this.#adjacency.has(neighbor)) {
                    return;
                }
                this.#adjacency.get(neighbor).add(point.text);
                this.#adjacency.get(point.text).add(neighbor);
                const neighborPoint = Point.from(neighbor);
                let weight = 1;
                if (point.hasLeftNeighbor(neighborPoint) && columnsToExpand.has(neighborPoint.x)) {
                    weight = additionalWeight;
                }
                if (point.hasTopNeighbor(neighborPoint) && rowsToExpand.has(neighborPoint.y)) {
                    weight = additionalWeight;
                }
                this.#edges.set(this.#toEdge(point.text, neighbor), weight);
            });
    }

    #weight(start, end) {
        return this.#edges.get(this.#toEdge(start, end)) ?? this.#edges.get(this.#toEdge(end, start));
    }

    #toEdge(start, end) {
        return `${start}-${end}`;
    }
}

class Point {
    static from(text) {
        const [x, y] = text.split(',').map(Number);
        const result = new Point(x, y);
        if (result.text !== text) {
            throw new Error('Invalid point');
        }
        return result;
    }

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.text = `${x},${y}`;
    }

    hasLeftNeighbor({x, y}) {
        return this.x === x + 1 && this.y === y;
    }

    hasTopNeighbor({x, y}) {
        return this.x === x && this.y === y + 1;
    }

    get potentialPreviousNeighbors() {
        return [
            new Point(this.x - 1, this.y).text,
            new Point(this.x, this.y - 1).text,
        ];
    }
}

class BinaryHeap {
    #elements = [];
    #scores = new Map();
    #indices = new Map();

    get length() {
        return this.#elements.length;
    }

    has(potentialElement) {
        return this.#scores.has(potentialElement);
    }

    push(element, score) {
        this.#elements.push(element);
        this.#scores.set(element, score);
        this.#bubbleUp(this.#elements.length - 1);
    }

    pop() {
        const result = this.#elements[0];
        const end = this.#elements.pop();
        if (this.#elements.length > 0) {
            this.#elements[0] = end;
            this.#sinkDown(0);
        }
        return result;
    }

    update(element, newScore) {
        if (!this.has(element)) {
            return;
        }
        const oldScore = this.#scores.get(element);
        if (oldScore === newScore) {
            return;
        }
        this.#scores.set(element, newScore);
        const oldIndex = this.#indices.get(element);
        if (oldScore < newScore) {
            this.#sinkDown(oldIndex);
            return;
        }
        this.#bubbleUp(oldIndex);
    }

    #bubbleUp(fromIndex) {
        const bubblingElement = this.#elements[fromIndex];
        while (fromIndex > 0) {
            const parentIndex = Math.floor((fromIndex + 1) >> 1) - 1;
            const parentElement = this.#elements[parentIndex];
            if (this.#scores.get(bubblingElement) >= this.#scores.get(parentElement)) {
                this.#indices.set(bubblingElement, fromIndex);
                break;
            }
            this.#elements[parentIndex] = bubblingElement;
            this.#elements[fromIndex] = parentElement;
            fromIndex = parentIndex;
        }
        this.#indices.set(bubblingElement, fromIndex);
    }

    #sinkDown(fromIndex) {
        const max = this.#elements.length;
        const sinkingElement = this.#elements[fromIndex];
        this.#indices.set(sinkingElement, fromIndex);
        while (true) {
            const rightChildIndex = (fromIndex + 1) << 1;
            const leftChildIndex = rightChildIndex - 1;
            let swapIndex = -1;
            if (leftChildIndex < max) {
                const leftChild = this.#elements[leftChildIndex];
                if (this.#scores.get(leftChild) < this.#scores.get(sinkingElement)) {
                    swapIndex = leftChildIndex;
                }
            }
            if (rightChildIndex < max) {
                const rightChild = this.#elements[rightChildIndex];
                if (this.#scores.get(rightChild) < (swapIndex !== -1 ? this.#scores.get(this.#elements[swapIndex]) : this.#scores.get(sinkingElement))) {
                    swapIndex = rightChildIndex;
                }
            }
            if (swapIndex === -1) {
                break;
            }
            const toSwap = this.#elements[swapIndex];
            this.#elements[fromIndex] = toSwap;
            this.#indices.set(toSwap, fromIndex);
            this.#elements[swapIndex] = sinkingElement;
            this.#indices.set(sinkingElement, swapIndex);
            fromIndex = swapIndex;
        }
    }
}

console.time();
/*console.log(
    sumGalaxiesPaths(
        `input here`,
        1000000
    )
);*/
console.timeEnd();
