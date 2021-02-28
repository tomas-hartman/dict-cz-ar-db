const readfile = require('./readfile');

const { analyzeLatinCharsInAr } = require('./analyze/latinCharsInAr');
const { analyzeLatinCharsInVal } = require('./analyze/latinCharsInVal');
const { analyzeRoots } = require('./analyze/roots');
const { analyzeDuplicates, analyzeDeepDuplicates } = require('./analyze/duplicates');
const { analyzeUncategorized, analyzeMissingVerbsNotation } = require('./analyze/tags');
const { analyzeTranscriptions } = require('./analyze/transcription');

// const path = require('path');
// const filename = path.resolve(__dirname, '../raw/Arabi__01__rocnik.txt');
const createOutputStream = require('./utils/createOutputStream');

/**
 * This analyzes raw source data and logs potential errors into output/logs
 * These errors include:
 *  - duplicate items
 *  - missing or corrupted roots
 *  - potentially incorrect values in arabic text and valencies
 */
const analyze = (filename) => {
    // Check latin chars in arabic text
    const outputLatinCharsInAr = createOutputStream('../../output/logs/', 'errors_latin_chars.txt');
    readfile(filename, (data) => analyzeLatinCharsInAr(data, outputLatinCharsInAr));
    
    // Check potentially unwanted latin characters in valency
    const outputLatinCharsInVal = createOutputStream('../../output/logs/', 'errors_latin_chars_val.txt');
    readfile(filename, (data) => analyzeLatinCharsInVal(data, outputLatinCharsInVal));
    
    // Check roots
    const outputRoot = createOutputStream('../../output/logs/', 'errors_root.txt');
    readfile(filename, (data) => analyzeRoots(data, outputRoot));
    
    // Analyze transcription
    const outputTranscriptions = createOutputStream('../../output/logs/', 'errors_transcription.txt');
    readfile(filename, (data) => analyzeTranscriptions(data, outputTranscriptions));
    
    // Analyze duplicates
    const outputDuplicates = createOutputStream('../../output/logs/', 'errors_duplicates.txt');
    analyzeDuplicates(outputDuplicates, filename);
    
    // TAGS:
    // analyze words without category
    const outputUncategorized = createOutputStream('../../output/logs/', 'errors_uncategorized.txt');
    readfile(filename, (data) => analyzeUncategorized(data, outputUncategorized));

    // analyze verbs without stem
    const outputMissingVerbsNotation = createOutputStream('../../output/logs/', 'errors_missing_verbs_notation.txt');
    readfile(filename, (data) => analyzeMissingVerbsNotation(data, outputMissingVerbsNotation));
};

module.exports = {analyze};



