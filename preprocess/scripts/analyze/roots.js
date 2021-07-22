function analyzeRoots(data, dataStream) {
    const [_ar, _val, _cz, root, _syn, _example, _transcription, tags] = data;

    const containsEthymTag = tags.includes('ethym_');
    const isToponym = tags.includes('toponyma');

    const regexNonStandardLetters = /^ž|-ž|7|2|R|ů|^g-|-g-|-g$|y/;
    const regexMissingAleph = /^-/g;
    const regexEmptyOfUnknown = /\s|[?]/;

    // Skip words that have empty root, but have ethymology info in tags
    if(root.trim() === '' && (containsEthymTag || isToponym)) return;

    // Kořen není vyplněn, obsahuje ?, mezeru (značí více slov, což je podezřelé), nebo začíná na "-" (chyba)
    if (root.match(regexNonStandardLetters) ) {
        dataStream.write('Error: root contains forbidden chars:\t' + data.join('\t') + '\n');
        
        return [root, data.join('\t')];
    } 
    
    if(root.match(regexEmptyOfUnknown)){
        dataStream.write('Error: root uncertain:\t' + data.join('\t') + '\n');

        return [root, data.join('\t')];
    } 
    
    if(root.trim() === ''){
        dataStream.write('Error: root is missing:\t' + data.join('\t') + '\n');

        return [root, data.join('\t')];
    }
    
    if(root.match(regexMissingAleph)) {
        dataStream.write('Error: aleph is missing:\t' + data.join('\t') + '\n');

        return [root, data.join('\t')];
    }

}

module.exports = { analyzeRoots };