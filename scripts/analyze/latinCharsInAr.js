const fs = require("fs");
const path = require("path");

const outputFileName = path.resolve(__dirname, "../../output/logs/errors_latin_chars.txt");
const writeStreamCharErrors = fs.createWriteStream(outputFileName);

/**
 * Function that checks if there are any non-arabic letters where mostly arabic should be (field ar)
 */
function analyzeLatinCharsInAr(data, dataStream = writeStreamCharErrors) {
    // should log all lines with possible unwanted latin chars in these fields
    const regex = /[\u0041-\u007a]/g;
    const regexSymbols = /[\/]/g;
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    if (ar.match(regex)) {
        dataStream.write(data.join("\t") + "\n");
    }
}

module.exports = analyzeLatinCharsInAr;