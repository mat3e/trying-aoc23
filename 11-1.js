const GALAXY = '#';

export function expand(input) {
    const lines = input.split('\n');
    const rowsToDuplicate = new Set();
    const columnsNotToDuplicate = new Set();
    lines.forEach((line, y) => {
        line = line.trim();
        if (!line.includes(GALAXY)) {
            rowsToDuplicate.add(y);
        }
        for (let x = 0; x < line.length; x++) {
            if (line[x] === GALAXY) {
                columnsNotToDuplicate.add(x);
            }
        }
    });
    return lines.flatMap((line, y) => {
        line = line.trim();
        const lineArrayResult = [];
        for (let x = 0; x < line.length; x++) {
            lineArrayResult.push(line[x]);
            if (!columnsNotToDuplicate.has(x)) {
                lineArrayResult.push(line[x]);
            }
        }
        const lineResult = lineArrayResult.join('');
        if (rowsToDuplicate.has(y)) {
            return [lineResult, lineResult];
        }
        return [lineResult];
    });
}

export function sumGalaxiesPaths(input) {
    const graph = new GalaxiesGraph(expand(input));
    let sum = 0;
    const galaxies = graph.galaxies;
    for (let i = 0; i < galaxies.length; i++) {
        graph.bfsBetweenGalaxies(galaxies[i], pathToOtherGalaxy => sum += pathToOtherGalaxy.length);
    }
    return sum / 2;
}

export class GalaxiesGraph {
    #galaxies = new Set();
    #adjacency = new Map();

    constructor(inputArray) {
        inputArray.forEach((line, y) => {
            for (let x = 0; x < line.length; x++) {
                const value = line[x];
                const point = this.#toPoint(x, y);
                if (value === GALAXY) {
                    this.#galaxies.add(point);
                }
                this.#adjacency.set(point, new Set());
                this.#connect(point, x, y);
            }
        });
    }

    get galaxies() {
        return [...this.#galaxies];
    }

    bfsBetweenGalaxies(start, galaxyPathFoundCallback, optionalEnd) {
        if (!this.#galaxies.has(start)) {
            throw new Error('Not a galaxy');
        }
        const queue = [start];
        const visited = new Set([start]);
        const pathToOtherGalaxies = new Map();
        while (queue.length > 0) {
            const currentPoint = queue.shift();
            if (this.#galaxies.has(currentPoint) && currentPoint !== start && (!optionalEnd || currentPoint === optionalEnd)) {
                const fromCurrentToStart = [];
                let currentPathPoint = currentPoint;
                while (currentPathPoint !== start) {
                    fromCurrentToStart.push(currentPathPoint);
                    currentPathPoint = pathToOtherGalaxies.get(currentPathPoint);
                }
                galaxyPathFoundCallback(fromCurrentToStart.reverse());
                if (optionalEnd) {
                    return;
                }
            }
            this.#adjacency.get(currentPoint).forEach((neighbor) => {
                if (visited.has(neighbor)) {
                    return;
                }
                visited.add(neighbor);
                queue.push(neighbor);
                pathToOtherGalaxies.set(neighbor, currentPoint);
            });
        }
    }

    #connect(currentPoint, x, y) {
        this.#potentialNeighbors(x, y)
            .forEach((neighbor) => {
                if (!this.#adjacency.has(neighbor)) {
                    return;
                }
                this.#adjacency.get(neighbor).add(currentPoint);
                this.#adjacency.get(currentPoint).add(neighbor);
            });
    }

    #potentialNeighbors(x, y) { // only existing (previous) ones
        return [
            this.#toPoint(x - 1, y),
            this.#toPoint(x, y - 1),
        ];
    }

    #toPoint(x, y) {
        return `${x},${y}`;
    }
}

/*console.log(sumGalaxiesPaths(
    `input here`));*/
