const fs = require('fs');

/**
 * @param {Bool} isError 
 * @param {String} msg 
 * @param {Number} errCode 
 */
const stopScript = function(
    isError = true,
    msg = getMessage().somethingWentWrong ? getMessage().somethingWentWrong : "Something went wrong",
    errCode = 1
) {
    if (isError) {
        console.error(msg + " Error code:", errCode);
    }
    process.exit(errCode);
}

const checkFileExists = function(path = "") {
    try {
        fs.accessSync(path, fs.constants.F_OK);
    } catch (err) {
        return false;
    }
    return true;
}
const checkFileReadeble = function(path = "") {
    try {
        fs.accessSync(path, fs.constants.R_OK);
    } catch (err) {
        return false;
    }
    return true;
}
const checkFileWriteble = function(path = "") {
    try {
        fs.accessSync(path, fs.constants.W_OK);
    } catch (err) {
        return false;
    }
    return true;
}
const isFile = function(path = "") {
    return fs.statSync(path).isFile();
}

module.exports.stopScript = stopScript;
module.exports.checkFileExists = checkFileExists;
module.exports.checkFileReadeble = checkFileReadeble;
module.exports.checkFileWriteble = checkFileWriteble;
module.exports.isFile = isFile;