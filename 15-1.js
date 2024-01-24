const MULTIPLIER = 17;
const BASE = 256;

export function hash(text) {
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
    'input here'
        .split(',')
        .map(code => hash(code))
        .reduce((acc, curr) => acc + curr, 0)
);
console.timeEnd();
