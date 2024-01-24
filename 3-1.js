const input = `input here`.split('\n');

class Point {
    #pointsFromPointWidth = [];

    constructor(x, y, value) {
        this.x = x - value.length + 1;
        this.y = y;
        this.value = value;
        this.#pointsFromPointWidth = rangeTo(this.value.length).map(i => `${this.x + i}x${this.y}`);
    }

    allIncludedPoints() {
        return this.#pointsFromPointWidth;
    }

    toString() {
        return `${this.x}x${this.y}`;
    }

    get potentialNeighbors() {
        if (this.value.length === 1) {
            return new Set(this.#potentialNeighbors(this.x, this.y));
        }
        return new Set([...rangeTo(this.value.length).flatMap(i => this.#potentialNeighbors(this.x + i, this.y))]);
    }

    #potentialNeighbors(x, y) {
        return [
            `${x - 1}x${y}`,
            `${x + 1}x${y}`,
            `${x}x${y - 1}`,
            `${x}x${y + 1}`,
            `${x - 1}x${y - 1}`,
            `${x + 1}x${y - 1}`,
            `${x - 1}x${y + 1}`,
            `${x + 1}x${y + 1}`,
        ].filter(neighbor => !this.#pointsFromPointWidth.includes(neighbor));
    }

    get asNumber() {
        return +this.value;
    }

    get symbolic() {
        return isSymbol(this.value);
    }
}

const pointsDictionary = new Map();
const adjacency = new Map();

input.forEach((line, row) => {
    let value = "";
    for (let column = 0; column < line.length; column++) {
        if (line[column] === '.' || isSymbol(line[column])) {
            processPoint(column - 1, row, value);
            value = "";
            if (isSymbol(line[column])) {
                processPoint(column, row, line[column]);
            }
            continue;
        }
        value += line[column];
    }
    processPoint(line.length - 1, row, value);
});

let sum = 0;
adjacency.forEach((neighborsSet, pointText) => {
    const hasSymbolicNeighbor = [...neighborsSet].some(neighbor => pointsDictionary.get(neighbor).symbolic);
    const point = pointsDictionary.get(pointText);
    if (!point.symbolic && hasSymbolicNeighbor) {
        sum += point.asNumber;
    }
});

console.log(sum);

function isSymbol(value) {
    return value !== '.' && isNaN(+value);
}

function processPoint(x, y, value) {
    if (value === "") {
        return;
    }
    const point = new Point(x, y, value);
    point.allIncludedPoints().forEach(pointText => pointsDictionary.set(pointText, point));
    adjacency.set(point.toString(), new Set());
    connectWithNeighbors(point);
}

function connectWithNeighbors(point) {
    const pointText = point.toString();
    point.potentialNeighbors.forEach(neighbor => {
        if (pointsDictionary.has(neighbor)) {
            const normalizedNeighbor = pointsDictionary.get(neighbor).toString();
            adjacency.get(pointText).add(normalizedNeighbor);
            adjacency.get(normalizedNeighbor).add(pointText);
        }
    });
}

function rangeTo(limit) {
    return [...Array(limit).keys()];
}
