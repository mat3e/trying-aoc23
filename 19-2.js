console.time();
console.log(countCombinations(
    `px{a<2006:qkq,m>2090:A,rfg}
    pv{a>1716:R,A}
    lnx{m>1548:A,A}
    rfg{s<537:gd,x>2440:R,A}
    qs{s>3448:A,lnx}
    qkq{x<1416:A,crn}
    crn{x>2662:A,R}
    in{s<1351:px,qqz}
    qqz{s>2770:qs,m<1801:hdj,R}
    gd{a>3333:R,R}
    hdj{m>838:A,pv}
    
    {x=787,m=2655,a=1222,s=2876}
    {x=1679,m=44,a=2067,s=496}
    {x=2036,m=264,a=79,s=2244}
    {x=2461,m=1339,a=466,s=291}
    {x=2127,m=1623,a=2188,s=1013}`));
console.timeEnd();

function countCombinations(input) {
    const adjacency = new Map();
    const reverseAdjacency = new Map([['A', new Set()], ['R', new Set()]]);
    const edges = new Map();
    const reverseEdges = new Map();
    const [workflows] = input.split(/\n\s*\n/);
    const parsedWorkflows = workflows
        .split('\n')
        .map(workflow => workflow.trim())
        .filter(workflow => !!workflow)
        .map(parseWorkflow);
    parsedWorkflows.forEach(([workflow]) => {
        adjacency.set(workflow, new Set());
        reverseAdjacency.set(workflow, new Set());
    });
    parsedWorkflows
        .forEach(([workflow, transitions]) => {
            const conditionsToNegate = [];
            transitions.forEach(([conditionOrNext, nextIfTrue]) => {
                if (!nextIfTrue) {
                    adjacency.get(workflow).add(conditionOrNext);
                    reverseAdjacency.get(conditionOrNext).add(workflow);
                    edges.set(`${workflow}-${conditionOrNext}`, negate(conditionsToNegate));
                    reverseEdges.set(`${conditionOrNext}-${workflow}`, negate(conditionsToNegate));
                    return;
                }
                adjacency.get(workflow).add(nextIfTrue);
                reverseAdjacency.get(nextIfTrue).add(workflow);
                edges.set(`${workflow}-${nextIfTrue}`, [conditionOrNext]);
                reverseEdges.set(`${nextIfTrue}-${workflow}`, [conditionOrNext]);
                conditionsToNegate.push(conditionOrNext);
            })
        });
    // return countAs(reverseAdjacency, reverseEdges);
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
            sum += dfs(adjacency, edges, visited, next, ...conditions, ...(edges.get(`${current}-${next}`) ?? []));
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
