const readfile = require('../readfile');

const { analyzeLatinCharsInAr } = require('./latinCharsInAr');
const { analyzeLatinCharsInVal } = require('./latinCharsInVal');
const { analyzeRoots } = require('./roots');
const { analyzeDuplicates } = require('./duplicates');
const { analyzeUncategorized, analyzeMissingVerbsNotation } = require('./tags');
const { analyzeTranscriptions } = require('./transcription');
const { analyzeVerbs } = require('./verbs');

// const path = require('path');
// const filename = path.resolve(__dirname, '../raw/Arabi__01__rocnik.txt');
const { createOutputStream } = require('../utils');

/**
 * This analyzes raw source data and logs potential errors into output/logs
 * These errors include:
 *  - duplicate items
 *  - missing or corrupted roots
 *  - potentially incorrect values in arabic text and valencies
 */
const analyze = (filename) => {
    // Check latin chars in arabic text
    const outputLatinCharsInAr = createOutputStream('../../output/logs/', 'errors_latin_chars.txt', filename);
    readfile(filename, (data) => analyzeLatinCharsInAr(data, outputLatinCharsInAr));
    
    // Check potentially unwanted latin characters in valency
    const outputLatinCharsInVal = createOutputStream('../../output/logs/', 'errors_latin_chars_val.txt', filename);
    readfile(filename, (data) => analyzeLatinCharsInVal(data, outputLatinCharsInVal));
    
    // Check roots
    const outputRoot = createOutputStream('../../output/logs/', 'errors_root.txt', filename);
    readfile(filename, (data) => analyzeRoots(data, outputRoot));
    
    // Analyze transcription
    const outputTranscriptions = createOutputStream('../../output/logs/', 'errors_transcription.txt', filename);
    readfile(filename, (data) => analyzeTranscriptions(data, outputTranscriptions));
    
    // Analyze duplicates
    const outputDuplicates = createOutputStream('../../output/logs/', 'errors_duplicates.txt', filename);
    analyzeDuplicates(outputDuplicates, filename);
    
    // TAGS:
    // analyze words without category
    /** @todo lze vyřešit pomocí getCategories */
    const outputUncategorized = createOutputStream('../../output/logs/', 'errors_uncategorized.txt', filename);
    readfile(filename, (data) => analyzeUncategorized(data, outputUncategorized));

    // analyze verbs without stem
    /** @todo bude řešit analyze/verbs */
    const outputMissingVerbsNotation = createOutputStream('../../output/logs/', 'errors_missing_verbs_notation.txt', filename);
    readfile(filename, (data) => analyzeMissingVerbsNotation(data, outputMissingVerbsNotation));
    
    // analyze verbs
    const outputErrorsInVerbs = createOutputStream('../../output/logs/', 'errors_verbs.txt', filename);
    readfile(filename, (data) => analyzeVerbs(data, outputErrorsInVerbs));
};

module.exports = {analyze};



