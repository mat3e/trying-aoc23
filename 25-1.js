function solve(input) {
    const g = new Graph(input);
    let kargerMinCutResult = g.kargerMinCut();
    while (kargerMinCutResult[2] / 2 !== 3) {
        kargerMinCutResult = g.kargerMinCut();
    }
    console.log(kargerMinCutResult);
    console.log(`Cut edges: ${kargerMinCutResult[2] / 2}`);
    return kargerMinCutResult[0].length * kargerMinCutResult[1].length;
}

class Graph {
    #adj = new Map();

    constructor(input) {
        const lines = input.split('\n')
            .map(line => line.trim())
            .map(line => line.replace(':', ''))
            .map(line => line.split(' '));
        lines.forEach((entries) => {
            const main = entries[0];
            if (!this.#adj.has(main)) {
                this.#adj.set(main, new Set());
            }
            for (let i = 1; i < entries.length; i++) {
                const neighbor = entries[i];
                if (!this.#adj.has(neighbor)) {
                    this.#adj.set(neighbor, new Set());
                }
                this.#adj.get(main).add(neighbor);
                this.#adj.get(neighbor).add(main);
            }
        });
    }

    kargerMinCut() {
        const subsets = new Map();
        const verticesArr = [...this.#adj.keys()];
        verticesArr.forEach(node => subsets.set(node, new Subset(node, 0)));
        let vertices = verticesArr.length;
        while (vertices > 2) {
            const randomVertex = verticesArr[Math.floor(Math.random() * verticesArr.length)];
            const randomNeighbor = [...this.#adj.get(randomVertex)][Math.floor(Math.random() * this.#adj.get(randomVertex).size)];
            const firstSubset = find(subsets, randomVertex);
            const secondSubset = find(subsets, randomNeighbor);
            if (firstSubset === secondSubset) {
                continue;
            }
            --vertices;
            union(subsets, firstSubset, secondSubset);
        }
        let edgesCut = 0;
        verticesArr.forEach((vertex) => {
            this.#adj.get(vertex).forEach((neighbor) => {
                if (find(subsets, vertex) !== find(subsets, neighbor)) {
                    edgesCut++;
                }
            });
        });
        const first = [];
        const firstParent = find(subsets, verticesArr[0]);
        const second = [];
        verticesArr.forEach(vertex => find(subsets, vertex) === firstParent ? first.push(vertex) : second.push(vertex));
        return [first, second, edgesCut];
    }
}

class Subset {
    constructor(parent, rank) {
        this.parent = parent;
        this.rank = rank;
    }
}

function union(subsets, first, second) {
    const firstRoot = find(subsets, first);
    const secondRoot = find(subsets, second);
    if (subsets.get(firstRoot).rank < subsets.get(secondRoot).rank) {
        subsets.get(firstRoot).parent = secondRoot;
        return;
    }
    if (subsets.get(firstRoot).rank > subsets.get(secondRoot).rank) {
        subsets.get(secondRoot).parent = firstRoot;
        return;
    }
    subsets.get(secondRoot).parent = firstRoot;
    subsets.get(firstRoot).rank++;
}

// union-find find root node
function find(subsets, node) {
    if (subsets.get(node).parent !== node) {
        subsets.get(node).parent = find(subsets, subsets.get(node).parent);
    }
    return subsets.get(node).parent;
}

console.time();
console.log(solve(
    `input here`));
console.timeEnd();
