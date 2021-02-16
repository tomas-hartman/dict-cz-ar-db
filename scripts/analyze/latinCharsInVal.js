const fs = require("fs");
const path = require("path");

const outputFileName = path.resolve(__dirname, "../../output/logs/errors_latin_chars_val.txt");
const writeStreamCharErrorsInVal = fs.createWriteStream(outputFileName);

/**
 * Function that checks if there are any non-arabic letters where mostly arabic should be (field ar)
 */
function analyzeLatinCharsInVal(data, dataStream = writeStreamCharErrorsInVal) {
    // should log all lines with possible unwanted latin chars in these fields
    const regex = /[\u0041-\u007a]/g;
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    if (val.match(regex)) {
        dataStream.write(data.join("\t") + "\n");
    }
}

module.exports = analyzeLatinCharsInVal;
