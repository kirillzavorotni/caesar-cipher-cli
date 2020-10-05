const argv = require('minimist')(process.argv.slice(2));
const config = require('./config');

// config
const getArgsName = config.getArgsName;
const getArgsValues = config.getArgsValues;

/**
 * Trying to fing correct requared parameters and its values.
 * If found return Obj like {a: "encode", s: "2"}, else false.
 * 
 * @returns {Object|Bool}
 */
const checkGetRequiredArgs = function () {
    if (!argv) return false;
    const args = getArgsKey().filter(key => {
        return key === getArgsName().a ||
            key === getArgsName().action ||
            key === getArgsName().s ||
            key === getArgsName().shift;
    });

    if (
        (args.includes(getArgsName().a) || args.includes(getArgsName().action)) &&
        (args.includes(getArgsName().s) || args.includes(getArgsName().shift))
    ) {
        let a;
        let s;

        // get action
        if (
            !a &&
            argv[getArgsName().a] &&
            (argv[getArgsName().a] === getArgsValues().encode || argv[getArgsName().a] === getArgsValues().decode)
        ) {
            a = argv[getArgsName().a];
        }
        if (
            !a &&
            argv[getArgsName().action] &&
            (argv[getArgsName().action] === getArgsValues().encode || argv[getArgsName().action] === getArgsValues().decode)
        ) {
            a = argv[getArgsName().action];
        }
        if (
            !a &&
            argv[getArgsName().a] &&
            Array.isArray(argv[getArgsName().a]) &&
            (argv[getArgsName().a].includes(getArgsValues().encode) || argv[getArgsName().a].includes(getArgsValues().decode))
        ) {
            a = argv[getArgsName().a];
        }
        if (
            !a &&
            argv[getArgsName().action] &&
            Array.isArray(argv[getArgsName().action]) &&
            (argv[getArgsName().action].includes(getArgsValues().encode) || argv[getArgsName().action].includes(getArgsValues().decode))
        ) {
            a = argv[getArgsName().action];
        }

        // get shift
        if (
            !s &&
            argv[getArgsName().s] &&
            Array.isArray(argv[getArgsName().s]) &&
            argv[getArgsName().s].length &&
            argv[getArgsName().s].find(s => Number.parseInt(s) === 0 || Number.parseInt(s) === -0 || Number.parseInt(s))
        ) {
            s = argv[getArgsName().s].find(s => Number.parseInt(s) === 0 || Number.parseInt(s) === -0 || Number.parseInt(s));
            s = Number.parseInt(s);
        }
        if (
            !s &&
            argv[getArgsName().shift] &&
            Array.isArray(argv[getArgsName().shift]) &&
            argv[getArgsName().shift].length &&
            argv[getArgsName().shift].find(shift => Number.parseInt(shift) === 0 || Number.parseInt(shift) === -0 || Number.parseInt(shift))
        ) {
            s = argv[getArgsName().shift].find(shift => Number.parseInt(shift) === 0 || Number.parseInt(shift) === -0 || Number.parseInt(shift));
            s = Number.parseInt(s);
        }
        if (
            !s &&
            Number.parseInt(argv[getArgsName().s]) === 0 || Number.parseInt(argv[getArgsName().s]) === -0 || Number.parseInt(argv[getArgsName().s])
        ) {
            s = Number.parseInt(argv[getArgsName().s]);
        }
        if (
            !s &&
            Number.parseInt(argv[getArgsName().shift]) === 0 || Number.parseInt(argv[getArgsName().shift]) === -0 || Number.parseInt(argv[getArgsName().shift])
        ) {
            s = Number.parseInt(argv[getArgsName().shift]);
        }

        if (a && (s === 0 || s === -0 || s)) {
            return {
                a: a,
                s: s
            };
        }
    }
    
    return false;
}

/**
 * Return Obj like {input: "./input.txt", output: "./output.txt"}
 * 
 * @returns {Object}
 */
const getOptionalArgs = function () {
    if (!argv) return false;

    const args = getArgsKey().filter(key => {
        return key === getArgsName().i ||
            key === getArgsName().input ||
            key === getArgsName().o ||
            key === getArgsName().output;
    });

    let i;
    let o;
    const res = {};

    // get input
    if (
        !i &&
        args.includes(getArgsName().i) &&
        Array.isArray(argv[getArgsName().i]) &&
        argv[getArgsName().i].length
    ) {
        i = argv[getArgsName().i][0];
    }
    if (
        !i &&
        args.includes(getArgsName().i) &&
        (argv[getArgsName().i] !== false && argv[getArgsName().i] !== true)
    ) {
        i = argv[getArgsName().i];
    }
    if (
        !i &&
        args.includes(getArgsName().input) &&
        Array.isArray(argv[getArgsName().input]) &&
        argv[getArgsName().input].length
    ) {
        i = argv[getArgsName().input][0];
    }
    if (
        !i &&
        args.includes(getArgsName().input) &&
        (argv[getArgsName().input] !== false && argv[getArgsName().input] !== true)
    ) {
        i = argv[getArgsName().input];
    }

    // get output
    if (
        !o &&
        args.includes(getArgsName().o) &&
        Array.isArray(argv[getArgsName().o]) &&
        argv[getArgsName().o].length
    ) {
        o = argv[getArgsName().o][0];
    }
    if (
        !o &&
        args.includes(getArgsName().o) &&
        (argv[getArgsName().o] !== false && argv[getArgsName().o] !== true)
    ) {
        o = argv[getArgsName().o];
    }
    if (
        !o &&
        args.includes(getArgsName().output) &&
        Array.isArray(argv[getArgsName().inoutputput]) &&
        argv[getArgsName().output].length
    ) {
        o = argv[getArgsName().output][0];
    }
    if (
        !o &&
        args.includes(getArgsName().output) &&
        (argv[getArgsName().output] !== false && argv[getArgsName().output] !== true)
    ) {
        o = argv[getArgsName().output];
    }
    
    if (i === 0 || i) {
        res.i = i.toString();
    }
    if (o === 0 || o) {
        res.o = o.toString();
    }

    return res;
}

/**
 * @returns {Array}
 */
function getArgsKey() {
    if (!argv) return [];
    return Object.keys(argv);
}

module.exports.checkGetRequiredArgs = checkGetRequiredArgs;
module.exports.getOptionalArgs = getOptionalArgs;
