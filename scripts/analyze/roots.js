const fs = require('fs');
const path = require('path');

const outputFileName = path.resolve(__dirname, '../../output/logs/errors_root.txt');
const writeStreamRootErrors = fs.createWriteStream(outputFileName);

function analyzeRoots(data, dataStream = writeStreamRootErrors) {
    const [_ar, _val, _cz, root, _syn, _example, _transcription, tags] = data;

    const containsEthymTag = tags.includes('ethym_');
    const isToponym = tags.includes('toponyma');

    const regexNonStandardLetters = /^ž|-ž|7|2|R|^g-|-g-|-g$/;
    const regexMissingAleph = /^-/g;
    const regexEmptyOfUnknown = /\s|[?]/;

    // Skip words that have empty root, but have ethymology info in tags
    if(root.trim() === '' && (containsEthymTag || isToponym)) return;

    // Kořen není vyplněn, obsahuje ?, mezeru (značí více slov, což je podezřelé), nebo začíná na "-" (chyba)
    if (root.match(regexNonStandardLetters) 
        || root.match(regexEmptyOfUnknown) 
        || root.trim() === '' 
        || root.match(regexMissingAleph)) {
        dataStream.write(data.join('\t') + '\n');

        return [root, data.join('\t')];
    }
}

module.exports = analyzeRoots;