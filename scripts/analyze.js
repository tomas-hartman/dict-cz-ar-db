const {Readable, Writable} = require("stream");
const fs = require("fs");
const path = require("path");
const readfile = require("./readfile");
const normalizeAr = require("./normalizeAr");

const filename = path.resolve(__dirname, "../raw/Arabi__01__rocnik.txt");
const writeStreamRootErrors = fs.createWriteStream('./errors_root.txt');
const writeStreamCharErrors = fs.createWriteStream('./errors_latin_chars.txt');
const writeStreamNormalized = fs.createWriteStream('./normalized.txt');

function logNormalizedData(data, dataStream = writeStreamNormalized){
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    const normalized = normalizeAr(ar);
    // const output = ar + " => " + normalized + "\n";
    const output = normalized + "\n";

    dataStream.write(output);
}

/**
 * Function that checks if there are any non-arabic letters where mostly arabic should be (field ar)
 */
function analyzeLatinCharsInAr(data, dataStream = writeStreamCharErrors){
    // should log all lines with possible unwanted latin chars in these fields
    const regex = /[\u0041-\u007a]/g;
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    if(ar.match(regex)){
        dataStream.write(data.join("\t") + "\n");
    }
}

function analyzeRoots(data, dataStream = writeStreamRootErrors) {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    // Kořen není vyplněn, obsahuje ?, mezeru (značí více slov, což je podezřelé), nebo začíná na "-" (chyba)
    if(root.match(/\s|[?]/) || root.trim() === "" || root.match(/^-/g)){
        dataStream.write(data.join("\t") + "\n");
    }
}

// Normalized words (not a check on its own, rather a helper)
// readfile(filename, logNormalizedData);

// Check latin chars in arabic text
readfile(filename, analyzeLatinCharsInAr);

// // Check roots
readfile(filename, analyzeRoots);

module.exports = {logNormalizedData, analyzeLatinCharsInAr, analyzeRoots};



