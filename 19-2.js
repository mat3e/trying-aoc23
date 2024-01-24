/*console.time();
console.log(countCombinations(
    `input here`));
console.timeEnd();*/

function countCombinations(input) {
    const adjacency = new Map();
    const edges = new Map();
    const [workflows] = input.split(/\n\s*\n/);
    const parsedWorkflows = workflows
        .split('\n')
        .map(workflow => workflow.trim())
        .filter(workflow => !!workflow)
        .map(parseWorkflow);
    parsedWorkflows.forEach(([workflow]) => {
        adjacency.set(workflow, new Set());
    });
    parsedWorkflows
        .forEach(([workflow, transitions]) => {
            const conditionsToNegate = [];
            transitions.forEach(([conditionOrNext, nextIfTrue]) => {
                if (!nextIfTrue) {
                    adjacency.get(workflow).add(conditionOrNext);
                    if (!edges.has(`${workflow}-${conditionOrNext}`)) {
                        edges.set(`${workflow}-${conditionOrNext}`, []);
                    }
                    edges.get(`${workflow}-${conditionOrNext}`).push(negate(conditionsToNegate));
                    return;
                }
                adjacency.get(workflow).add(nextIfTrue);
                if (!edges.has(`${workflow}-${nextIfTrue}`)) {
                    edges.set(`${workflow}-${nextIfTrue}`, []);
                }
                edges.get(`${workflow}-${nextIfTrue}`).push([...negate(conditionsToNegate), conditionOrNext]);
                conditionsToNegate.push(conditionOrNext);
            })
        });
    return dfs(adjacency, edges);
}

function dfs(adjacency, edges, visited = new Set(), current = 'in', ...conditions) {
    if (visited.has(current)) {
        return 0;
    }
    if (current === 'A') {
        const conditionsMap = conditions
            .filter(condition => !!condition)
            .reduce((groupedConditions, condition) => {
                groupedConditions.get(condition[0]).push(condition);
                return groupedConditions;
            }, new Map([['x', []], ['m', []], ['a', []], ['s', []]]));
        return [
            countInRange(conditionsMap.get('x')),
            countInRange(conditionsMap.get('m')),
            countInRange(conditionsMap.get('a')),
            countInRange(conditionsMap.get('s'))
        ].reduce((acc, value) => acc * value, 1);
    }
    visited.add(current);
    let sum = 0;
    if (adjacency.has(current)) {
        adjacency.get(current).forEach((next) => {
            // more than one edge can lead to the same node
            (edges.get(`${current}-${next}`) ?? []).forEach((newConditions) => {
                sum += dfs(adjacency, edges, visited, next, ...conditions, ...newConditions);
            });
        });
    }
    return sum;
}

function parseWorkflow(input) {
    const [name, functionsString] = input.split('{');
    const functions = functionsString
        .replace('}', '')
        .split(',')
        .map(functionString => functionString.split(':'));
    return [name, functions];
}

export function negate(conditions) {
    return conditions.map((condition) => {
        if (condition.includes('>')) {
            // x>30 => x<31
            const [part, value] = condition.split('>');
            return `${part}<${(+value) + 1}`;
        }
        // x<30 => x>29
        const [part, value] = condition.split('<');
        return `${part}>${value - 1}`;
    });
}

export function countInRange(conditions) {
    const range = {min: 1, max: 4_000};
    if (!conditions || conditions.length === 0) {
        return range.max;
    }
    conditions.forEach((condition) => {
        const [, value] = condition.split(/[><]/);
        if (condition.includes('>')) {
            range.min = Math.max(range.min, +value + 1);
            return;
        }
        range.max = Math.min(range.max, +value - 1);
    });
    return Math.max(range.max - range.min + 1, 0);
}
