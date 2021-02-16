const path = require("path");
const readfile = require("./readfile");

const analyzeLatinCharsInAr = require("./analyze/latinCharsInAr");
const analyzeLatinCharsInVal = require("./analyze/latinCharsInVal");
const analyzeRoots = require("./analyze/roots");
const { analyzeDuplicates, analyzeDeepDuplicates } = require("./analyze/duplicates");

const filename = path.resolve(__dirname, "../raw/Arabi__01__rocnik.txt");

/**
 * This analyzes raw source data and logs potential errors into output/logs
 * These errors include:
 *  - duplicate items
 *  - missing or corrupted roots
 *  - potentially incorrect values in arabic text and valencies
 */

// Check latin chars in arabic text
readfile(filename, analyzeLatinCharsInAr);

// Check potentially unwanted latin characters in valency
readfile(filename, analyzeLatinCharsInVal);

// Check roots
readfile(filename, analyzeRoots);

// Analyze duplicates
analyzeDuplicates();

module.exports = {analyzeLatinCharsInVal, analyzeLatinCharsInAr, analyzeRoots};



