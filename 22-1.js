export function countRemovals(bricks) {
    const [adjacency, reverseAdjacency] = findAdjacent(bricks);
    let result = 0;
    bricks.forEach((brick, index) => {
        const colliding = adjacency.get(index);
        // can be removed if all colliding have alternative bricks to rest on
        if ([...colliding].every(i => reverseAdjacency.get(i).size !== 1)) {
            result++;
        }
    });
    return result;
}

function findAdjacent(bricks) {
    const adjacency = new Map();
    const reverseAdjacency = new Map();
    for (let i = 0; i < bricks.length; i++) {
        adjacency.set(i, new Set());
        const currentBrick = bricks[i];
        for (let j = i + 1; j < bricks.length; j++) {
            const {z, ...potentialCollision} = bricks[j];
            const {result} = collides(currentBrick, potentialCollision);
            if (result && currentBrick.z + currentBrick.zLength === z) {
                adjacency.get(i).add(j);
                if (!reverseAdjacency.has(j)) {
                    reverseAdjacency.set(j, new Set());
                }
                reverseAdjacency.get(j).add(i);
            }
        }
    }
    return [adjacency, reverseAdjacency];
}

export function settle(input) {
    const initialBricks = input.split('\n')
        .map(line => line.trim())
        .map(parseLine)
        .sort(sortByZ);
    const targetBricks = [];
    for (let i = 0; i < initialBricks.length; i++) {
        const brick = initialBricks[i];
        const targetBefore = targetBricks.length;
        for (let j = targetBricks.length - 1; j >= 0; j--) {
            const targetBrick = targetBricks[j];
            const {result: colliding} = collides(brick, targetBrick);
            if (colliding) {
                targetBricks.push({...brick, z: targetBrick.z + targetBrick.zLength});
                break;
            }
        }
        if (targetBricks.length === targetBefore) {
            targetBricks.push({...brick, z: 1});
        }
        // check highest first
        targetBricks.sort(sortByFullZ);
    }
    return targetBricks;
}

function sortByFullZ({z: a, zLength: aLength}, {z: b, zLength: bLength}) {
    return a + aLength - b - bLength;
}

export function sortByZ({z: a}, {z: b}) {
    return a - b;
}

export function parseLine(line) {
    const [start, end] = line.split('~');
    const [x, y, z] = start.split(',').map(Number);
    const [xEnd, yEnd, zEnd] = end.split(',').map(Number);
    return {
        x,
        y,
        z,
        xLength: xEnd - x + 1,
        yLength: yEnd - y + 1,
        zLength: zEnd - z + 1,
    };
}

export function toString(brick) {
    return `${brick.x},${brick.y},${brick.z}~${brick.xLength + brick.x - 1},${brick.yLength + brick.y - 1},${brick.zLength + brick.z - 1}`;
}

export function collides(first, second) {
    const x = collidesOnAxis(first, second, 'x');
    const y = collidesOnAxis(first, second, 'y');
    return {result: x && y, x, y};
}

function collidesOnAxis(first, second, axis) {
    return (first[axis] <= second[axis] && second[axis] <= first[axis] + first[axis + 'Length'] - 1)
        || (second[axis] <= first[axis] && first[axis] <= second[axis] + second[axis + 'Length'] - 1);
}

/*console.time();
const settled = settle(
    `input here`);
console.log(countRemovals(settled));
console.timeEnd();*/
