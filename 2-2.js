const [maxRed, maxGreen, maxBlue] = [12, 13, 14];
const [redPattern, greenPattern, bluePattern] = [/(\d+) red/, /(\d+) green/, /(\d+) blue/];

`input here`.split('\n')
    .map(gameData => {
        const gameAndCubes = gameData.split(': ');
        const cubeSets = gameAndCubes[1].split(('; ')).map(set => {
            const red = redPattern.exec(set);
            const green = greenPattern.exec(set);
            const blue = bluePattern.exec(set);
            return {
                red: red ? parseInt(red[1]) : 0,
                green: green ? parseInt(green[1]) : 0,
                blue: blue ? parseInt(blue[1]) : 0,
            };
        });
        return {
            game: +gameAndCubes[0].replace('Game ', ''),
            cubeSets
        };
    })
    .map(({cubeSets}) => {
        return cubeSets.reduce(({red: maxRed, green: maxGreen, blue: maxBlue}, {red, green, blue}) => {
            return {
                red: Math.max(maxRed, red),
                green: Math.max(maxGreen, green),
                blue: Math.max(maxBlue, blue),
            };
        }, {red: 0, green: 0, blue: 0});
    })
    .map(({red, green, blue}) => (red * green * blue))
    .reduce((acc, current) => acc + current, 0);
