const {Readable, Writable} = require("stream");
const fs = require("fs");
const path = require("path");
const readfile = require("./readfile");
const normalizeAr = require("./normalizeAr");

const filename = path.resolve(__dirname, "../raw/Arabi__01__rocnik.txt");
const writeStream = fs.createWriteStream('./roots.txt');
const writeStreamRootErrors = fs.createWriteStream('./errors.txt');
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
function checkLatinCharsInAr(){
// should log all lines with possible unwanted latin chars in these fields
}

function checkRoots(data, dataStream = writeStreamRootErrors) {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    if(root.match(/\s|[?]/) || root.trim() === ""){
        dataStream.write(data.join("\t") + "\n");
    }
}

function writeRootsFile(data, dataStream = writeStream) {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    dataStream.write(root + "\n");
}

// Normalized words
readfile(filename, logNormalizedData);

// // Check roots
// readfile(filename, checkRoots);

// Write file
// readfile(filename, writeRootsFile);



