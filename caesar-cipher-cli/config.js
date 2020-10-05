/**
 * Config
 * Get propery names
 */
const getArgsName = function () {
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
const getArgsValues = function () {
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

module.exports.getArgsName = getArgsName;
module.exports.getArgsValues = getArgsValues;
module.exports.getAlfabetsAsListOfArray = getAlfabetsAsListOfArray;
module.exports.getMessage = getMessage;
