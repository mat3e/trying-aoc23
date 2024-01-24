export function sumAcceptedPartsRatings(input) {
    const [workflows, parts] = input.split(/\n\s*\n/);
    const accepted = [];
    const parsedWorkflows = new Map(
        workflows
            .split('\n')
            .map(workflow => workflow.trim())
            .filter(workflow => !!workflow)
            .map(parseWorkflow)
    );
    parts
        .split('\n')
        .map(part => part.trim())
        .filter(part => !!part)
        .map(parsePart)
        .forEach((part) => {
            let workflow = 'in';
            while (workflow !== 'A' && workflow !== 'R') {
                const functions = parsedWorkflows.get(workflow);
                workflow = functions.find(func => func(part))(part);
            }
            if (workflow === 'A') {
                accepted.push(part);
            }
        });
    return accepted.reduce((acc, {x = 0, m = 0, a = 0, s = 0}) => acc + x + m + a + s, 0);
}

export function parsePart(input) {
    return eval(`(function() { return ${input}; })()`.replaceAll('=', ':'));
}

export function parseWorkflow(input) {
    const [name, functionsString] = input.split('{');
    const functions = functionsString
        .replace('}', '')
        .split(',')
        .map(functionString => functionString.split(':'))
        .map(([conditionOrValue, resultIfTrue]) => resultIfTrue ? (obj => eval('obj.' + conditionOrValue) ? resultIfTrue : false) : () => conditionOrValue);
    return [name, functions];
}

/*console.time();
console.log(sumAcceptedPartsRatings(
    `input here`));
console.timeEnd();*/
