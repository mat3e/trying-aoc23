const REMOVE = '-';
const PUT = '=';

export function divideIntoBoxes(input) {
    return input.split(',')
        .map(instruction => instruction.includes(REMOVE) ? [REMOVE, instruction.replace(REMOVE, '')] : [PUT].concat(instruction.split(PUT)))
        .reduce((result, [operation, lens, value]) => {
            const boxNumber = hash(lens);
            if (!result.has(boxNumber)) {
                result.set(boxNumber, new Map());
            }
            if (operation === REMOVE) {
                result.get(boxNumber).delete(lens);
                return result;
            }
            result.get(boxNumber).set(lens, +value);
            return result;
        }, new Map());
}

export function calculateBoxFocusingPower(boxNumber, lenses) {
    return [...lenses.entries()]
        .map(([, focalLength], index) => (boxNumber + 1) * (index + 1) * focalLength)
        .reduce((sum, current) => sum + current, 0);
}

const MULTIPLIER = 17;
const BASE = 256;

function hash(text) {
    let result = 0;
    for (let i = 0; i < text.length; i++) {
        result += text.charCodeAt(i);
        result *= MULTIPLIER;
        result %= BASE;
    }
    return result;
}

console.time();
console.log(
    [...divideIntoBoxes('input here').entries()]
        .map(([boxNumber, box]) => calculateBoxFocusingPower(boxNumber, box))
        .reduce((acc, curr) => acc + curr, 0));
console.timeEnd();
