export function picksTheorem(input) {
    let currentPoint = new Point(0, 0);
    const verticesSet = new Set([currentPoint.toString()]);
    let perimeter = 0;
    input.split('\n')
        .map(line => line.trim())
        .map(line => line.split('(#'))
        .map(([, code]) => [parseInt(code.slice(0, 5), 16), code[5]]).forEach(([weight, direction]) => {
        perimeter += weight;
        switch (direction) {
            case '0':
                currentPoint = currentPoint.addX(weight);
                verticesSet.add(currentPoint.toString());
                break;
            case '2':
                currentPoint = currentPoint.addX(-weight);
                verticesSet.add(currentPoint.toString());
                break;
            case '3':
                currentPoint = currentPoint.addY(-weight);
                verticesSet.add(currentPoint.toString());
                break;
            case '1':
                currentPoint = currentPoint.addY(weight);
                verticesSet.add(currentPoint.toString());
                break;
        }
    });
    // shoelaceFormula => A
    // perimeter => b
    // i => interior points
    // https://en.wikipedia.org/wiki/Pick%27s_theorem
    // Pick's theorem: A = i + b/2 - 1 => i = A - b/2 + 1
    // i + b is the total number of points
    return perimeter + shoelaceFormula([...verticesSet].map(Point.fromString)) - perimeter / 2 + 1;
}

/**
 * https://www.theoremoftheday.org/GeometryAndTrigonometry/Shoelace/TotDShoelace.pdf
 *
 * https://www.101computing.net/the-shoelace-algorithm/
 */
function shoelaceFormula(vertices) {
    let firstSum = 0;
    let secondSum = 0;
    for (let i = 0; i < vertices.length - 1; i++) {
        firstSum += vertices[i].x * vertices[i + 1].y;
        secondSum += vertices[i + 1].x * vertices[i].y;
    }
    firstSum += vertices[vertices.length - 1].x * vertices[0].y;
    secondSum += vertices[0].x * vertices[vertices.length - 1].y;
    return Math.abs(firstSum - secondSum) / 2;
}

class Point {
    static fromString(string) {
        const [x, y] = string.slice(1, -1).split(', ');
        return new Point(parseInt(x), parseInt(y));
    }

    #x = NaN;
    #y = NaN;

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    addX(x) {
        return new Point(this.#x + x, this.#y);
    }

    addY(y) {
        return new Point(this.#x, this.#y + y);
    }


    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    toString() {
        return `(${this.#x}, ${this.#y})`;
    }
}

/*console.time();
console.log(picksTheorem(
    `input here`));
console.timeEnd();*/
