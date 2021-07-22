const { normalizeCz, normalizeAr } = require('../../preprocess/scripts/normalize');
const { convertToNormTranscription } = require('../../preprocess/scripts/convert/convertToNormTranscription');

const isRootInArabic = (input) => {
    let text = input;
    text = normalizeCz(text);
    text = normalizeAr(text);

    // if it does not contain arabic letters or contains non-arabic letters (mixed)
    if(!text.match(/[\u0620-\u065f]/g) || text.match(/[^\u0620-\u065f]/g)) return false;

    return true;
};

/**
 * Cleans input
 * Acts differently for arabic input and latin input
 * @param {String} input 
 * @returns {String} Cleaned input (root_lat or root_ar form)
 */
const clean = (input) => {
    let output = input;
    
    if(isRootInArabic(input)){
        output = output.replace(/[\s-.]/g, '');
        output = output.replace(/[أإؤئ]/g, 'ء');
        
        return output;
    }

    output = convertToNormTranscription(output);
    output = output.replace(/[\s-.]/g, '');

    return output;
};

/**
 * 
 * @param {String} input root in various forms
 */
function resolveRoot(input) {
    /**
     * Valid forms:
     * 1. s-f-r
     * 2. k t b
     * 3. ktb (asi jenom jako fallback?)
     * 4. كتب
     * 5. S-7-7 + S-H-H
     * 6. w-l-?
     * 7. 
     * 
     * invalid: - je jedno, je to validní, jenom se to nenajde
     * 1. k tb
     * 2. kitáb (=== obsahuje vokály)
     * 3. 
     */

    const query = clean(input); // todo: some basic normalization, maybe validate input?

    // it might return [table, column, query]
    if(isRootInArabic(query)) return ['roots', 'root_ar', query];

    return ['roots', 'root_lat', query];
}

module.exports = { resolveRoot, isRootInArabic, clean };