const fs = require('fs');
const path = require('path');
const stream = require('stream');

const config = require('./config');
const getArguments = require('./getArguments');
const getShiftedCharacters = require('./getShiftedCharacters');
const helper = require('./helper');

// config
const getArgsValues = config.getArgsValues;
const getAlfabetsAsListOfArray = config.getAlfabetsAsListOfArray;
const getMessage = config.getMessage;

// functions
const checkGetRequiredArgs = getArguments.checkGetRequiredArgs;
const getOptionalArgs = getArguments.getOptionalArgs;
const getShiftedCharactersAsString = getShiftedCharacters.getShiftedCharactersAsString;

// helpers
const stopScript = helper.stopScript;
const checkFileExists = helper.checkFileExists;
const checkFileReadeble = helper.checkFileReadeble;
const checkFileWriteble = helper.checkFileWriteble;
const isFile = helper.isFile;

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
    }

    // if input but not out file
    if (param.a && Number.isInteger(param.s) && param.i && !param.o) {
        if (!checkFileExists(param.i)) {
            stopScript(true, `"${param.i}" ${getMessage().fileNotExists}`);
        }
        if (!checkFileReadeble(param.i)) {
            stopScript(true, `"${param.i}" ${getMessage().accessDined}`);
        }
        if (!isFile(param.i)) {
            stopScript(true, `"${param.i}" ${getMessage().isNotFile}`);
        }

        fileToStdOut(param);
    }

    // if input and output aren't exists
    if (param.a && Number.isInteger(param.s) && !param.i && !param.o) {
        stdInToStdOut(param);
    }

    // if output file exists but not input file
    if (param.a && Number.isInteger(param.s) && param.o && !param.i) {
        if (!checkFileExists(param.o)) {
            stopScript(true, `"${param.o}" ${getMessage().fileNotExists}`);
        }
        if (!checkFileWriteble(param.o)) {
            stopScript(true, `"${param.o}" ${getMessage().accessDined}`);
        }
        if (!isFile(param.o)) {
            stopScript(true, `"${param.o}" ${getMessage().isNotFile}`);
        }

        stdInToFile(param);
    }
}

function stdInToStdOut(param) {
    const read = process.stdin;
    read.setEncoding('utf8');
    const transform = new CipherTransformer(param.s);
    const write = process.stdout;
    read.pipe(transform).pipe(write);
}

function fileToFile(param) {
    const read = fs.createReadStream(param.i);
    const transform = new CipherTransformer(param.s);
    const write = fs.createWriteStream(param.o);
    read.pipe(transform).pipe(write);
}

function fileToStdOut(param) {
    const read = fs.createReadStream(param.i);
    const transform = new CipherTransformer(param.s);
    const write = process.stdout;
    read.pipe(transform).pipe(write);
}

function stdInToFile(param) {
    const read = process.stdin;
    read.setEncoding('utf8');
    const transform = new CipherTransformer(param.s);
    const write = fs.createWriteStream(param.o);
    read.pipe(transform).pipe(write);
}
