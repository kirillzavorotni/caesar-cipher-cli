const argv = require('minimist')(process.argv.slice(2));

// console.log(argv);
// console.error('Something went wrong. Error code:', 1);
// process.exit(1);

/**
 * Config
 * Get propery names
 */
function getPropertyName() {
    return {
        a: "a",
        action: "action",
        s: "s",
        shift: "shift",
        i: "i",
        input: "input",
        o: "o",
        output: "output"
    };
}

/**
 * Config
 * Get args value
 */
function getArgsValues() {
    return {
        encode: "encode",
        decode: "decode",
        input: "input.txt",
        output: "output.txt"
    };
}

/**
 * Config
 * Get messages
 */
function getMessage() {
    return {
        somethingWentWrong: "Something went wrong.",
        invalidRequaredParameters: "Invalid requared parameters. -s/--shift[number] and -a/--action[string] parameters are requared."
    };
}



/**********************************************************/

function start() {
    const requaredArgs = getRequiredArgs();
    if (!requaredArgs) stopScript(true, getMessage().invalidRequaredParameters);
    console.log("requaredArgs = ", requaredArgs);
    return;
}

/**
 * Trying to fing correct requared parameters and its values.
 * If found return Obj like {a: "encode", s: "2"}, else false.
 * 
 * @returns {Object|Bool}
 */
function getRequiredArgs() {
    if (!argv) return false;
    const args = getArgsKey().filter(key => {
        return key === getPropertyName().a ||
            key === getPropertyName().action ||
            key === getPropertyName().s ||
            key === getPropertyName().shift;
    });

    if (
        (args.includes(getPropertyName().a) || args.includes(getPropertyName().action)) &&
        (args.includes(getPropertyName().s) || args.includes(getPropertyName().shift))
    ) {
        let a;
        let s;

        // get action
        if (
            !a &&
            argv[getPropertyName().a] &&
            (argv[getPropertyName().a] === getArgsValues().encode || argv[getPropertyName().a] === getArgsValues().decode)
        ) {
            a = argv[getPropertyName().a];
        }
        if (
            !a &&
            argv[getPropertyName().action] &&
            (argv[getPropertyName().action] === getArgsValues().encode || argv[getPropertyName().action] === getArgsValues().decode)
        ) {
            a = argv[getPropertyName().action];
        }
        if (
            !a &&
            argv[getPropertyName().a] &&
            Array.isArray(argv[getPropertyName().a]) &&
            (argv[getPropertyName().a].includes(getArgsValues().encode) || argv[getPropertyName().a].includes(getArgsValues().decode))
        ) {
            a = argv[getPropertyName().a];
        }
        if (
            !a &&
            argv[getPropertyName().action] &&
            Array.isArray(argv[getPropertyName().action]) &&
            (argv[getPropertyName().action].includes(getArgsValues().encode) || argv[getPropertyName().action].includes(getArgsValues().decode))
        ) {
            a = argv[getPropertyName().action];
        }

        // get shift
        if (
            !s &&
            argv[getPropertyName().s] &&
            Array.isArray(argv[getPropertyName().s]) &&
            argv[getPropertyName().s].length &&
            argv[getPropertyName().s].find(s => Number.parseInt(s))
        ) {
            s = argv[getPropertyName().s].find(s => Number.parseInt(s));
            s = Number.parseInt(s);
        }
        if (
            !s &&
            argv[getPropertyName().shift] &&
            Array.isArray(argv[getPropertyName().shift]) &&
            argv[getPropertyName().shift].length &&
            argv[getPropertyName().shift].find(shift => Number.parseInt(shift))
        ) {
            s = argv[getPropertyName().shift].find(shift => Number.parseInt(shift));
            s = Number.parseInt(s);
        }
        if (
            !s &&
            argv[getPropertyName().s] && Number.parseInt(argv[getPropertyName().s])
        ) {
            s = Number.parseInt(argv[getPropertyName().s]);
        }
        if (
            !s &&
            argv[getPropertyName().shift] && Number.parseInt(argv[getPropertyName().shift])
        ) {
            s = Number.parseInt(argv[getPropertyName().shift]);
        }

        if (a && s) {
            return {
                a: a,
                s: s
            };
        }
    }
    
    return false;
}

/**
 * @returns {Array}
 */
function getArgsKey() {
    if (!argv) return [];
    return Object.keys(argv);
}

/**
 * @param {Bool} isError 
 * @param {String} msg 
 * @param {Number} errCode 
 */
function stopScript(
    isError = true,
    msg = getMessage().somethingWentWrong ? getMessage().somethingWentWrong : "",
    errCode = 1
) {
    if (isError) {
        console.error(msg + " Error code:", errCode);
    }
    process.exit(errCode);
}

start();