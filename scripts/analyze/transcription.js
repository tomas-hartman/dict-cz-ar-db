const createOutputStream = require('../utils/createOutputStream');

const outputStream = createOutputStream('../../output/logs/', 'errors_transcription.txt');

/**
 * Function that checks if there are any non-arabic letters where mostly arabic should be (field ar)
 */
function analyzeTranscriptions(data, dataStream = outputStream) {
    // should log all lines with possible unwanted latin chars in these fields
    const regexStem = /I{0,1}V?X?I{0,}\./g;
    const regexSpecialChars = /[[\]{}<>=!?#\\/]/g;
    const [_ar, _val, _cz, _root, _syn, _example, transcription, _tags] = data;


    if (transcription.match(regexStem) || transcription.match(regexSpecialChars)) {
        dataStream.write(data.join('\t') + '\n');

        return [transcription, data.join('\t')];
    }
}

module.exports = analyzeTranscriptions;
