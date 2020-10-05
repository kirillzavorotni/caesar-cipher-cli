const helper = require('./helper');

// helpers
const stopScript = helper.stopScript;

/**
 * 
 * @param {Array} alfaberArrayList 
 * @param {String} str 
 * @param {Number} shift 
 */
const getShiftedCharactersAsString = function(alfaberArrayList = [], str = "...", shift = 0) {
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

module.exports.getShiftedCharactersAsString = getShiftedCharactersAsString;