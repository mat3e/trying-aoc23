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
    static from(input) {
        const modules = new Map();
        const connections = new Map();
        input.split('\n').map(line => line.trim()).forEach((line) => {
            const currentDependencies = line.split(' -> ')[1].split(', ');
            const moduleName = line.slice(1, line.indexOf(' '));
            switch (line[0]) {
                case 'b':
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
        modules.forEach((module, name) => connections.get(name).forEach(dependency => module.add(modules.get(dependency) ?? new Module(dependency))));
        return new ModuleConfiguration(modules.values(), connections.get('broadcaster').map(name => modules.get(name)));
    }

    #broadcast = [];
    #count = {
        [Pulse.LOW]: 0,
        [Pulse.HIGH]: 0,
    }
    #allModules = [];

    constructor(modules, broadcast) {
        this.#allModules.push(...modules);
        this.#broadcast.push(...broadcast);
    }

    pressTheButton() {
        this.#count[Pulse.LOW] += 1 + this.#broadcast.length;
        let nextActions = this.#broadcast
            .map(module => module.receive(Pulse.LOW))
            .filter(({signal}) => signal);
        while (nextActions.length > 0) {
            nextActions.forEach(({signal, destinations}) => {
                this.#count[signal] += destinations.length;
            });
            nextActions = nextActions
                .flatMap(action => this.#allModules.map(module => module.reduce(action)))
                .filter(({signal}) => signal);
        }
    }

    get count() {
        return this.#count;
    }
}

const config = ModuleConfiguration.from(
    `%cf -> tz
        %kr -> xn, gq
        %cp -> sq, bd
        broadcaster -> vn, sj, tg, kn
        %hc -> pm
        %fd -> xn, mj
        %qz -> xf
        %vf -> mc, pm
        %zm -> rz, pm
        %cn -> bd, qz
        %jj -> bp
        %ks -> ff
        %nb -> xn, ks
        %bm -> pm, vf
        &xn -> kc, jb, cb, tg, ks, tx
        %lm -> rk
        %dn -> bd, cn
        %ft -> dn
        %pn -> pm, ll
        %rk -> bp, fs
        %tz -> bp, gp
        %mc -> jx
        %fs -> kx
        %jf -> bd, fm
        %rz -> hc, pm
        %tg -> cb, xn
        &hf -> rx
        %vp -> pn
        &pm -> ll, mc, sj, vd, vp
        %rn -> kc, xn
        %vn -> bd, cp
        &nd -> hf
        %fm -> bd, gc
        %ff -> xn, fd
        &bp -> cf, fh, pc, kn, fs, gn, lm
        &pc -> hf
        %mj -> xn
        %qg -> bd
        %fh -> lm
        %kc -> nb
        %xf -> bd, jf
        %gc -> qg, bd
        &bd -> vn, sq, qz, ft, nd
        %jb -> kr
        %gp -> bp, rp
        %gq -> xn, rn
        %sj -> pm, bm
        %rp -> bp, jj
        %sq -> ft
        %cb -> jb
        &vd -> hf
        %gn -> cf
        %kx -> gn, bp
        %ll -> zm
        &tx -> hf
        %jx -> md, pm
        %md -> pm, vp
        %kn -> fh, bp`);

[...new Array(1000).keys()].forEach(() => config.pressTheButton());

console.log(config.count);
