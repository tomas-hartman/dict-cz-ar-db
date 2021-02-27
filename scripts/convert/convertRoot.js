const conversionTable = require('./conversionTable');
const readfile = require('../readfile');
const path = require('path');

const file = path.join(__dirname, '../../output/roots.txt');

function convertRoot([_root], cb) {
    const rootArr = _root.split('-');

    const convertedRoot = rootArr.map((letter) => {
        if (conversionTable[letter])
            return conversionTable[letter];

        return letter;
    });

    const output = convertedRoot.join('');

    console.log(output);
    if(cb) cb(output);
    return output;
}

readfile(file, convertRoot);
