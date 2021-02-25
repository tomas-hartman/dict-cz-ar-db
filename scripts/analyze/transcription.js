const fs = require("fs");
const path = require("path");

const outputFileName = path.resolve(__dirname, "../../output/logs/errors_transcription.txt");
const outputStream = fs.createWriteStream(outputFileName);

/**
 * Function that checks if there are any non-arabic letters where mostly arabic should be (field ar)
 */
function analyzeTranscriptions(data, dataStream = outputStream) {
    // should log all lines with possible unwanted latin chars in these fields
    const regexStem = /I{0,1}V?X?I{0,}\./g;
    const regexSpecialChars = /[\[\]\{\}<>=!?#\\\/]/g;
    const [ar, val, cz, root, syn, example, transcription, tags] = data;


    if (transcription.match(regexStem) || transcription.match(regexSpecialChars)) {
        dataStream.write(data.join("\t") + "\n");
    }
}

module.exports = analyzeTranscriptions;
