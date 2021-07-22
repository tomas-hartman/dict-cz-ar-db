function analyzeUncategorized(data, dataStream) {
    const regex = /cat_/g;
    const [_ar, _val, _cz, _root, _syn, _example, _transcription, tags] = data;

    if (!tags.match(regex)) {
        dataStream.write(data.join('\t') + '\n');

        return [tags, data.join('\t')];
    }
}

/**
 * Checks two conditions - if item has category and does not have stem info or vice versa
 * @param {*} data 
 * @param {*} dataStream 
 */
function analyzeMissingVerbsNotation(data, dataStream) {
    // should log all lines with possible unwanted latin chars in these fields
    const regex = /cat_slovesa/g;
    const regexOtherCategory = /cat_/g;
    const regexStem = /_kmen/g;
    const [_ar, _val, _cz, _root, _syn, _example, _transcription, tags] = data;

    const hasCategory = tags.match(regex);
    const hasOtherCategory = tags.match(regexOtherCategory);
    const hasStemInfo = tags.match(regexStem);

    if ((hasCategory && !hasStemInfo) || (!hasCategory && hasStemInfo && !hasOtherCategory) ) {
        dataStream.write(data.join('\t') + '\n');

        return [tags, data.join('\t')];
    }
}

module.exports = {analyzeUncategorized, analyzeMissingVerbsNotation};