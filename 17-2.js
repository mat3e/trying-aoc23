export function dijkstraSolve(input) {
    const graph = new Graph(input);
    const queue = new BinaryHeap();
    const dist = new Map();
    const statesDictionary = new Map();
    //const path = new Map();
    let current = new UltraCrucibleState(0, 0, RIGHT);
    let currentAsText = current.toSnapshot();
    dist.set(currentAsText, 0);
    queue.push(currentAsText, 0);
    statesDictionary.set(currentAsText, current);
    while (queue.length > 0) {
        currentAsText = queue.pop();
        current = statesDictionary.get(currentAsText);
        if (current.toPoint() === graph.targetPoint) {
            const result = dist.get(currentAsText);
            /*const pathSteps = [currentAsText];
            while (path.has(currentAsText)) {
                currentAsText = path.get(currentAsText);
                pathSteps.unshift(currentAsText);
            }
            console.log(pathSteps.join(' => '));*/
            return result;
        }
        const currentPoint = current.toPoint();
        current.chooseAvailable(graph.neighborsOf(currentPoint)).forEach(nextState => {
            const nextStateAsText = nextState.toSnapshot();
            const nextStatePoint = nextState.toPoint();
            statesDictionary.set(nextStateAsText, nextState);
            const potentialDistance = dist.get(currentAsText) + graph.weight(currentPoint, nextStatePoint);
            if (!dist.has(nextStateAsText) || potentialDistance < dist.get(nextStateAsText)) {
                dist.set(nextStateAsText, potentialDistance);
                queue.update(nextStateAsText, potentialDistance);
                //path.set(nextStateAsText, currentAsText);
            }
        });
    }
    return -1;
}

class Graph {
    #points = new Map();
    #adjacency = new Map();
    #edges = new Map();
    #targetX = Number.NEGATIVE_INFINITY;
    #targetY = Number.NEGATIVE_INFINITY;

    constructor(input) {
        const lines = input.split('\n').map(line => line.trim());
        this.#targetY = lines.length - 1;
        lines.forEach((line, y) => {
            for (let x = 0; x < line.length; x++) {
                const weight = +line[x];
                this.#points.set(toPointText(x, y), weight);
                this.#adjacency.set(toPointText(x, y), new Set());
                this.#plug(x, y, weight);
                this.#targetX = Math.max(this.#targetX, x);
            }
        });
    }

    get targetPoint() {
        return toPointText(this.#targetX, this.#targetY);
    }

    neighborsOf(pointText) {
        const directNeighborsArray = [...this.#adjacency.get(pointText)];
        const result = new Set(directNeighborsArray) // direct neighbors
        directNeighborsArray
            .flatMap(neighborText => [...this.#adjacency.get(neighborText)])
            .flatMap(neighborText => [...this.#adjacency.get(neighborText)])
            .flatMap(neighborText => [...this.#adjacency.get(neighborText)]) // 4 steps away
            .forEach(farNeighborText => result.add(farNeighborText));
        return [...result].map(neighborText => this.#fromPointText(neighborText));
    }

    weight(from, to) {
        return this.#sumEdges(from, to);
    }

    #sumEdges(from, to) {
        const [fromX, fromY] = this.#fromPointText(from);
        const [toX, toY] = this.#fromPointText(to);
        return this.#sumWidthEdges(fromX, toX, toY) + this.#sumHeightEdges(fromX, fromY, toY);
    }

    #sumWidthEdges(fromX, toX, y) {
        if (fromX === toX) {
            return 0;
        }
        const change = fromX < toX ? (x => x + 1) : (x => x - 1);
        let result = 0;
        while (fromX !== toX) {
            const newX = change(fromX);
            result += this.#edges.get(this.#toEdge(toPointText(fromX, y), toPointText(newX, y)));
            fromX = newX;
        }
        return isNaN(result) ? Number.POSITIVE_INFINITY : result;
    }

    #sumHeightEdges(x, fromY, toY) {
        if (fromY === toY) {
            return 0;
        }
        const change = fromY < toY ? (y => y + 1) : (y => y - 1);
        let result = 0;
        while (fromY !== toY) {
            const newY = change(fromY);
            result += this.#edges.get(this.#toEdge(toPointText(x, fromY), toPointText(x, newY)));
            fromY = newY;
        }
        return isNaN(result) ? Number.POSITIVE_INFINITY : result;
    }

    #plug(x, y, weight) {
        const point = toPointText(x, y);
        // potential neighbors
        [[x, y + 1], [x + 1, y], [x, y - 1], [x - 1, y]].forEach(([potentialX, potentialY]) => {
            const potentialNeighbor = toPointText(potentialX, potentialY);
            if (this.#points.has(potentialNeighbor)) {
                this.#adjacency.get(point).add(potentialNeighbor);
                this.#adjacency.get(potentialNeighbor).add(point);
                this.#edges.set(this.#toEdge(point, potentialNeighbor), this.#points.get(potentialNeighbor));
                this.#edges.set(this.#toEdge(potentialNeighbor, point), weight);
            }
        });
    }

    #toEdge(start, end) {
        return `${start}-${end}`;
    }

    #fromPointText(neighbor) {
        return neighbor.split(',').map(n => +n);
    }
}

const [RIGHT, DOWN, LEFT, UP] = ['R', 'D', 'L', 'U'];

class UltraCrucibleState {
    #x = NaN;
    #y = NaN;
    #direction = NaN;
    #movesCount = NaN;

    constructor(x, y, direction, moves = 0) {
        this.#x = x;
        this.#y = y;
        this.#direction = direction;
        this.#movesCount = moves;
    }

    chooseAvailable(pointsToChooseFrom) {
        const potentialMoves = this.#potentialMoves;
        return pointsToChooseFrom
            .filter(([x, y]) => potentialMoves.some(([potentialX, potentialY]) => potentialX === x && potentialY === y))
            .filter(([x, y]) => !this.#isContinuation(x, y) || this.#movesCount < 10)
            .map(([x, y]) => this.#moveTo(x, y));
    }

    toSnapshot() {
        return this.toPoint() + `-${this.#direction},${this.#movesCount}`;
    }

    toPoint() {
        return toPointText(this.#x, this.#y);
    }

    get #potentialMoves() {
        switch (this.#direction) {
            case RIGHT:
                return [this.#continuationMove, [this.#x, this.#y + 4], [this.#x, this.#y - 4]];
            case DOWN:
                return [this.#continuationMove, [this.#x + 4, this.#y], [this.#x - 4, this.#y]];
            case LEFT:
                return [this.#continuationMove, [this.#x, this.#y + 4], [this.#x, this.#y - 4]];
            case UP:
                return [this.#continuationMove, [this.#x + 4, this.#y], [this.#x - 4, this.#y]];
        }
    }

    #moveTo(x, y) {
        if (this.#isContinuation(x, y)) {
            return new UltraCrucibleState(x, y, this.#direction, this.#movesCount + 1);
        }
        // we can only change for 4 moves in a row
        return new UltraCrucibleState(x, y, this.#directionFor(x, y), 4);
    }

    #isContinuation(x, y) {
        const [continuationX, continuationY] = this.#continuationMove;
        return continuationX === x && continuationY === y;
    }

    get #continuationMove() {
        switch (this.#direction) {
            case RIGHT:
                return [this.#x + 1, this.#y];
            case DOWN:
                return [this.#x, this.#y + 1];
            case LEFT:
                return [this.#x - 1, this.#y];
            case UP:
                return [this.#x, this.#y - 1];
        }
    }

    #directionFor(x, y) {
        if (x === this.#x) {
            return y > this.#y ? DOWN : UP;
        }
        return x > this.#x ? RIGHT : LEFT;
    }
}

function toPointText(x, y) {
    return `${x},${y}`;
}

// https://github.com/mat3e/js-game/blob/main/src/engine/pathfinding/heap.ts
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
            this.push(element, newScore);
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

/*console.time();
console.log(dijkstraSolve(
    `input here`));
console.timeEnd();*/
