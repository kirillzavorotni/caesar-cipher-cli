const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');
const stream = require('stream');

// console.log(argv);
// console.error('Something went wrong. Error code:', 1);
// process.exit(1);

/**
 * Config
 * Get propery names
 */
function getArgsName() {
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
    };
}

/**
 * Config
 * Get list of alfabets
 */
function getAlfabetsAsListOfArray() {
    return [
        ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
        ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    ]
}

/**
 * Config
 * Get messages
 */
function getMessage() {
    return {
        somethingWentWrong: "Something went wrong.",
        invalidRequaredParameters: "Invalid requared parameters. -s/--shift[--shift=-2 or -s=-2] and -a/--action[-a=encode or --action=decode] parameters are requared.",
        fileNotExists: "file not exists.",
        accessDined: "аile access denied.",
        isNotFile: "is not a file."
    };
}

class CipherTransformer extends stream.Transform {
    constructor(shift) {
        super();
        this._shift = shift;
    }

    _transform(data, encoding, callback) {
        this.push(getShiftedCharactersAsString(getAlfabetsAsListOfArray(), data.toString(), this._shift));
        callback();
    }
}

start();

/**********************************************************/

/**
 * Entry point
 */
function start() {
    const requaredArgs = checkGetRequiredArgs();
    const optionalArgs = getOptionalArgs();

    if (!requaredArgs) {
        stopScript(true, getMessage().invalidRequaredParameters);
    }

    const parameters = {...requaredArgs, ...optionalArgs };

    whatToDo(parameters);
}

function whatToDo(param) {
    param.a = param.a ? param.a : "";
    param.s = Number.isInteger(param.s) ? param.s : "";
    param.i = param.i ? path.join(__dirname, param.i) : "";
    param.o = param.o ? path.join(__dirname, param.o) : "";

    // check encode or decode
    if (param.s && param.a && param.a === getArgsValues().decode) {
        param.s = param.s * -1;
    }

    console.log("param = ", param);
    // return;

    // if input to output file
    if (param.a && Number.isInteger(param.s) && param.i && param.o) {
        if (!checkFileExists(param.i)) {
            stopScript(true, `"${param.i}" ${getMessage().fileNotExists}`);
        }
        if (!checkFileReadeble(param.i)) {
            stopScript(true, `"${param.i}" ${getMessage().accessDined}`);
        }
        if (!isFile(param.i)) {
            stopScript(true, `"${param.i}" ${getMessage().isNotFile}`);
        }
        if (!checkFileExists(param.o)) {
            stopScript(true, `"${param.o}" ${getMessage().fileNotExists}`);
        }
        if (!checkFileWriteble(param.o)) {
            stopScript(true, `"${param.o}" ${getMessage().accessDined}`);
        }
        if (!isFile(param.o)) {
            stopScript(true, `"${param.o}" ${getMessage().isNotFile}`);
        }

        fileToFile(param);
        return;
    }
}

function fileToFile(param) {
    const read = fs.createReadStream(param.i);
    const transform = new CipherTransformer(param.s);
    const write = fs.createWriteStream(param.o);
    read.pipe(transform).pipe(write);
}

function checkFileExists(path = "") {
    try {
        fs.accessSync(path, fs.constants.F_OK);
    } catch (err) {
        return false;
    }
    return true;
}
function checkFileReadeble(path = "") {
    try {
        fs.accessSync(path, fs.constants.R_OK);
    } catch (err) {
        return false;
    }
    return true;
}
function checkFileWriteble(path = "") {
    try {
        fs.accessSync(path, fs.constants.W_OK);
    } catch (err) {
        return false;
    }
    return true;
}
function isFile(path = "") {
    return fs.statSync(path).isFile();
}

/**
 * 
 * @param {Array} alfaberArrayList 
 * @param {String} str 
 * @param {Number} shift 
 */
function getShiftedCharactersAsString(alfaberArrayList = [], str = "...", shift = 0) {
    const result = [];

    str.split("").forEach(char => {
        const res = getShiftedCharacter(alfaberArrayList, shift, char);
        if (!res) {
            stopScript();
        }
        result.push(res);
    });

    return result.join("");
}

/**
 * 
 * @param {Array} alfArrList list of alfabet arrays 
 * @param {Number} shiftNum 
 * @param {String} curVal 
 * @returns {String|Number|Boolean}
 */
function getShiftedCharacter(alfArrList, shiftNum, curVal) {
    if (
        !alfArrList ||
        !alfArrList.length ||
        !Number.isInteger(shiftNum) ||
        !curVal
    ) {
        return false;
    }

    const alfArr = alfArrList.find(arr => {
        if (arr.includes(curVal)) {
            return true;
        }
    });

    if (!alfArr) {
        return curVal;
    }
    
    const index = alfArr.indexOf(curVal);
    
    if (index === -1) {
        return false;
    }
    
    if (alfArr[index+shiftNum]) {
        return alfArr[index+shiftNum];
    }
    
    let i = index;
    let j = shiftNum;
    
    if (shiftNum >= 0) {
        while(j >= 0) {
            if (j === 0) {
                return alfArr[i];
            }

            if (!alfArr[i+1]) {
                i = 0;
            } else {
                i++;
            }

            j--;
        }
    
    return alfArr[i];
        
    }
    
    if (shiftNum < 0) {
        
        while(j <= 0) {
            if (j === 0) {
                return alfArr[i];
            }

            if (!alfArr[i-1]) {
                i = alfArr.length - 1;
            } else {
                i--;
            }

            j++;
            
        }
    
    return alfArr[i];
        
    }
    
    return false;
}

/**
 * Return Obj like {input: "./input.txt", output: "./output.txt"}
 * 
 * @returns {Object}
 */
function getOptionalArgs() {
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
 * Trying to fing correct requared parameters and its values.
 * If found return Obj like {a: "encode", s: "2"}, else false.
 * 
 * @returns {Object|Bool}
 */
function checkGetRequiredArgs() {
    if (!argv) return false;
    const args = getArgsKey().filter(key => {
        return key === getArgsName().a ||
            key === getArgsName().action ||
            key === getArgsName().s ||
            key === getArgsName().shift;
    });

    // console.log(args);
    // console.log(argv);

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
    msg = getMessage().somethingWentWrong ? getMessage().somethingWentWrong : "Something went wrong",
    errCode = 1
) {
    if (isError) {
        console.error(msg + " Error code:", errCode);
    }
    process.exit(errCode);
}
