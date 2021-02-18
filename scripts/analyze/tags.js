const fs = require("fs");
const path = require("path");

// analyze words without category
const outputFileNameBase = "errors_uncategorized"
const outputFileName = path.resolve(__dirname, `../../output/logs/${outputFileNameBase}.txt`);
const outputStream = fs.createWriteStream(outputFileName);

// analyze verbs without stem
const outputFileNameBaseVerbs = "errors_missing_verbs_notation"
const outputFileNameVerbs = path.resolve(__dirname, `../../output/logs/${outputFileNameBaseVerbs}.txt`);
const outputStreamVerbs = fs.createWriteStream(outputFileNameVerbs);


function analyzeUncategorized(data, dataStream = outputStream) {
    const regex = /cat_/g;
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    if (!tags.match(regex)) {
        dataStream.write(data.join("\t") + "\n");
    }
}

/**
 * Checks two conditions - if item has category and does not have stem info or vice versa
 * @param {*} data 
 * @param {*} dataStream 
 */
function analyzeMissingVerbsNotation(data, dataStream = outputStreamVerbs) {
    // should log all lines with possible unwanted latin chars in these fields
    const regex = /cat_slovesa/g;
    const regexOtherCategory = /cat_/g;
    const regexStem = /_kmen/g;
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    const hasCategory = tags.match(regex);
    const hasOtherCategory = tags.match(regexOtherCategory)
    const hasStemInfo = tags.match(regexStem);

    if ((hasCategory && !hasStemInfo) || (!hasCategory && hasStemInfo && !hasOtherCategory) ) {
        dataStream.write(data.join("\t") + "\n");
    }
}

module.exports = {analyzeUncategorized, analyzeMissingVerbsNotation};