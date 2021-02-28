/**
 * Function that checks if there are any non-arabic letters where mostly arabic should be (field ar)
 */
function analyzeLatinCharsInVal(data, dataStream) {
    // should log all lines with possible unwanted latin chars in these fields
    const regex = /[\u0041-\u007a]/g;
    const [_ar, val, _cz, _root, _syn, _example, _transcription, _tags] = data;

    if (val.match(regex)) {
        dataStream.write(data.join('\t') + '\n');

        return [val, data.join('\t')];
    }
}

module.exports = {analyzeLatinCharsInVal};
