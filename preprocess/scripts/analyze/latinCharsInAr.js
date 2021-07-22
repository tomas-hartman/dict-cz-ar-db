/**
 * Function that checks if there are any non-arabic letters where mostly arabic should be (field ar)
 */
function analyzeLatinCharsInAr(data, dataStream) {
    // should log all lines with possible unwanted latin chars in these fields
    const regex = /[\u0041-\u007a]/g;
    const _regexSymbols = /[/]/g;
    const [ar, _val, _cz, _root, _syn, _example, _transcription, _tags] = data;

    if (ar.match(regex)) {
        dataStream.write(data.join('\t') + '\n');
        
        return [ar, data.join('\t')];
    }
}

module.exports = {analyzeLatinCharsInAr};