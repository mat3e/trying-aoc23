export class Graph {
    #colors = new Map();
    #adjacency = new Map();
    #maxWidth = Number.NEGATIVE_INFINITY;
    #maxHeight = Number.NEGATIVE_INFINITY;
    #minWidth = Number.POSITIVE_INFINITY;
    #minHeight = Number.POSITIVE_INFINITY;

    constructor(input) {
        const currentPoint = [0, 0];
        let recentText = toPointText(...currentPoint);
        this.#colors.set(recentText, '');
        this.#adjacency.set(recentText, new Set());
        input.split('\n')
            .map(line => line.trim())
            .map(line => line.split(' '))
            .map(([direction, length, color]) => [direction, parseInt(length), color])
            .forEach(([direction, length, color]) => {
                switch (direction) {
                    case 'R':
                        for (let x = 0; x < length; x++) {
                            currentPoint[0]++;
                            const newRecentText = toPointText(...currentPoint);
                            this.#connect(newRecentText, color, recentText);
                            recentText = newRecentText;
                        }
                        break;
                    case 'L':
                        for (let x = 0; x < length; x++) {
                            currentPoint[0]--;
                            const newRecentText = toPointText(...currentPoint);
                            this.#connect(newRecentText, color, recentText);
                            recentText = newRecentText;
                        }
                        break;
                    case 'U':
                        for (let y = 0; y < length; y++) {
                            currentPoint[1]--;
                            const newRecentText = toPointText(...currentPoint);
                            this.#connect(newRecentText, color, recentText);
                            recentText = newRecentText;
                        }
                        break;
                    case 'D':
                        for (let y = 0; y < length; y++) {
                            currentPoint[1]++;
                            const newRecentText = toPointText(...currentPoint);
                            this.#connect(newRecentText, color, recentText);
                            recentText = newRecentText;
                        }
                        break;
                }
                this.#maxWidth = Math.max(this.#maxWidth, currentPoint[0]);
                this.#maxHeight = Math.max(this.#maxHeight, currentPoint[1]);
                this.#minWidth = Math.min(this.#minWidth, currentPoint[0]);
                this.#minHeight = Math.min(this.#minHeight, currentPoint[1]);
            });
    }

    #connect(current, color, previous) {
        if (current === '0,0') {
            this.#adjacency.get(current).add(previous);
            return;
        }
        this.#colors.set(current, color);
        this.#adjacency.get(previous).add(current);
        this.#adjacency.set(current, new Set([previous]));
    }

    get cycleLength() {
        return this.#adjacency.size;
    }

    get totalWrapped() {
        let wrapped = new Set();
        // not in cycle, as [0, 0] is and just 4 directions to come back to [0, 0]
        const points = [[1, 1]];
        while (points.length > 0) {
            const [x, y] = points.pop();
            const current = toPointText(x, y);
            if (wrapped.has(current) || this.#colors.has(current) || (x < this.#minWidth || x > this.#maxWidth) || (y < this.#minHeight || y > this.#maxHeight)) {
                continue;
            }
            wrapped.add(current);
            [
                [x + 1, y],
                [x - 1, y],
                [x, y + 1],
                [x, y - 1],
            ].forEach(([neighborX, neighborY]) => points.push([neighborX, neighborY]));
        }
        return this.cycleLength + wrapped.size;
    }
}

function toPointText(x, y) {
    return `${x},${y}`;
}

console.time();
console.log(new Graph(
    `input here`).totalWrapped);
console.timeEnd();
