const Pulse = {
    LOW: 'low',
    HIGH: 'high',
};

const noAction = {
    name: "nothing",
};

function transitionAction(signal, destinations, source) {
    return {
        name: "transition",
        signal,
        destinations,
        source,
        toString() {
            return this.destinations
                .map((destination) => source.toString() + ' -' + signal + '-> ' + destination.toString())
                .join('\n');
        },
    };
}

// action -> module.reduce -> module.receive -> module.send -> action

class Module {
    #destinations = [];
    #name;

    constructor(name) {
        this.#name = name;
    }

    add(destination) {
        this.#destinations.push(destination.registerIn(this));
    }

    registerIn(parent) {
        return this;
    }

    send(signal) {
        if (!signal || !this.#destinations.length) {
            return noAction;
        }
        return transitionAction(signal, this.#destinations, this);
    }

    reduce({name, destinations, signal, source}) {
        if (name === 'nothing') {
            return noAction;
        }
        if (!destinations.includes(this)) {
            return noAction;
        }
        return this.receive(signal, source);
    }

    receive(signal, source) {
        return this.send(null);
    }

    get nextDestinations() {
        return this.#destinations && this.#destinations.flatMap(destination => destination.nextDestinations);
    }

    toString() {
        return this.#name;
    }
}

class FlipFlop extends Module {
    #off = true;

    // override
    receive(signal) {
        if (signal === Pulse.HIGH) {
            // nothing
            return this.send(null);
        }
        this.#off = !this.#off;
        return this.send(this.#off ? Pulse.LOW : Pulse.HIGH);
    }

    get on() {
        return !this.#off;
    }
}

class Conjunction extends Module {
    #inputs = new Map();

    // override
    registerIn(parent) {
        this.#inputs.set(parent, Pulse.LOW);
        return super.registerIn(parent);
    }

    // override
    receive(signal, source) {
        this.#inputs.set(source, signal);
        if ([...this.#inputs.values()].some(input => input !== Pulse.HIGH)) {
            return this.send(Pulse.HIGH);
        }
        return this.send(Pulse.LOW);
    }
}

class ModuleConfiguration {
    #broadcast = [];
    #allModules = [];
    #nameForCycle = '';

    constructor(modules, broadcast, nameForCycle) {
        this.#allModules.push(...modules);
        this.#broadcast.push(...broadcast);
        this.#nameForCycle = nameForCycle;
    }

    pressTheButton() {
        const result = new Map();
        let nextActions = this.#broadcast
            .map(module => module.receive(Pulse.LOW))
            .filter(({signal}) => signal);
        while (nextActions.length > 0) {
            const actionsToCycle = nextActions.filter(({signal, destinations, source}) =>
                destinations.some(destination => destination.toString() === this.#nameForCycle) && signal === Pulse.HIGH);
            if (actionsToCycle.length > 0) {
                actionsToCycle.forEach(({source}) => result.set(source.toString(), true));
            }
            nextActions = nextActions
                .flatMap(action => this.#allModules.map(module => module.reduce(action)))
                .filter(({signal}) => signal);
        }
        return result;
    }
}

function parse(input) {
    const modules = new Map();
    const connections = new Map();
    const reverseConnections = new Map();
    input.split('\n').map(line => line.trim()).forEach((line) => {
        const currentDependencies = line.split(' -> ')[1].split(', ');
        const moduleName = line.slice(1, line.indexOf(' '));
        switch (line[0]) {
            case 'b':
                modules.set('broadcaster', new Module('broadcaster'));
                connections.set('broadcaster', currentDependencies);
                break;
            case '%':
                modules.set(moduleName, new FlipFlop(moduleName));
                connections.set(moduleName, currentDependencies);
                break;
            case '&':
                modules.set(moduleName, new Conjunction(moduleName));
                connections.set(moduleName, currentDependencies);
                break;
        }
    });
    modules.forEach((module, name) => connections.get(name).forEach((dependencyName) => {
        if (!modules.has(dependencyName)) {
            modules.set(dependencyName, new Module(dependencyName));
            connections.set(dependencyName, []);
        }
        if (!reverseConnections.has(dependencyName)) {
            reverseConnections.set(dependencyName, []);
        }
        module.add(modules.get(dependencyName));
        reverseConnections.get(dependencyName).push(name);
    }));
    const nameBeforeTarget = reverseConnections.get('rx')[0]; // just one Conjunction connecting 'rx' => 'hf'
    const config = new ModuleConfiguration(
        modules.values(),
        connections.get('broadcaster').map(name => modules.get(name)),
        nameBeforeTarget
    );
    let iterations = 0;
    // 'hf' is connected to other modules, and each is set to high cyclically (we look for those cycles)
    const result = new Map(reverseConnections.get(nameBeforeTarget).map(name => [name, -1]));
    while ([...result.values()].some(count => count === -1)) {
        ++iterations;
        [...config.pressTheButton().entries()].forEach(([name, found]) => {
            if (found) {
                result.set(name, iterations);
            }
        });
    }
    // all prime numbers (otherwise ordinary LCM)
    console.log([...result.values()].reduce((multiplication, current) => multiplication * current, 1));
}

parse(
    `input here`);
