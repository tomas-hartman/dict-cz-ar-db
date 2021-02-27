const createOutputStream = require('../utils/createOutputStream');

// analyze words without category
const outputStreamUncategorized = createOutputStream('../../output/logs/', 'errors_uncategorized.txt');
// analyze verbs without stem
const outputStreamVerbsNotation = createOutputStream('../../output/logs/', 'errors_missing_verbs_notation.txt');

function analyzeUncategorized(data, dataStream = outputStreamUncategorized) {
    const regex = /cat_/g;
    const [_ar, _val, _cz, _root, _syn, _example, _transcription, tags] = data;

    if (!tags.match(regex)) {
        dataStream.write(data.join('\t') + '\n');
    }
}

/**
 * Checks two conditions - if item has category and does not have stem info or vice versa
 * @param {*} data 
 * @param {*} dataStream 
 */
function analyzeMissingVerbsNotation(data, dataStream = outputStreamVerbsNotation) {
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
    }
}

module.exports = {analyzeUncategorized, analyzeMissingVerbsNotation};