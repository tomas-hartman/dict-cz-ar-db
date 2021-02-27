const createOutputStream = require('../utils/createOutputStream');

const outputStream = createOutputStream('../../output/logs/', 'errors_latin_chars_val.txt');

/**
 * Function that checks if there are any non-arabic letters where mostly arabic should be (field ar)
 */
function analyzeLatinCharsInVal(data, dataStream = outputStream) {
    // should log all lines with possible unwanted latin chars in these fields
    const regex = /[\u0041-\u007a]/g;
    const [_ar, val, _cz, _root, _syn, _example, _transcription, _tags] = data;

    if (val.match(regex)) {
        dataStream.write(data.join('\t') + '\n');
    }
}

module.exports = analyzeLatinCharsInVal;
