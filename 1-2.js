const patterns = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
};

`input here`.split('\n')
    .map((txt) => {
        const {minP: firstTextual, maxP: lastTextual, min, max} = Object.keys(patterns)
            .map(pattern => ([pattern, txt.indexOf(pattern), txt.lastIndexOf(pattern)]))
            .reduce((acc, [pattern, first, last]) => {
                const replaceMin = first !== -1 && first < acc.min;
                const replaceMax = last !== -1 && last > acc.max
                return {
                    min: replaceMin ? first : acc.min,
                    minP: replaceMin ? pattern : acc.minP,
                    max: replaceMax ? last : acc.max,
                    maxP: replaceMax ? pattern : acc.maxP,
                };
            }, {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY, minP: 'zero', maxP: 'zero'});
        let shift = 0; // e.g. 'eight226three5sevenhhxhqxns' would insert 7 before 5 without shift
        if (firstTextual !== 'zero') {
            txt = txt.slice(0, min) + patterns[firstTextual] + txt.slice(min);
            shift = 1;
        }
        lastTextual !== 'zero' && (txt = txt.slice(0, max + shift) + patterns[lastTextual] + txt.slice(max + shift));
        return txt;
    })
    .map(txt => txt.replaceAll(/[A-Za-z]/g, ''))
    .map(digitsOnly => +(digitsOnly[0] + digitsOnly[digitsOnly.length - 1]))
    .reduce((sum, curr) => sum + curr, 0);
