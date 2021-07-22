const { parseVerb } = require('../transform/parseVerb');
const { parseNoun } = require('../transform/parseNoun');
const { getMeaningVariant, getCategories } = require('../utils');

/**
 * Enhanced variant of convertToCsv's convertFile()
 * @param {String} data 
 * @returns {Object} 
 */
function resolveWord(data) {
    const [ar, _val, _cz, _root, _syn, _example, _transcription, tags] = data;

    const categories = getCategories(tags);

    const isVerb = categories.includes('cat_slovesa');
    const isNoun = categories.includes('cat_substantiva');

    let parsedObj = {};

    if(isVerb) {
        parsedObj = parseVerb(data);
    } else if(isNoun) {
        parsedObj = parseNoun(data);
    } else {
        parsedObj = {ar};
    }

    const getOutput = (parsed) => {
        const output = {
            ar: undefined, 
            plural: undefined, 
            masdar: undefined, 
            stemVowel: undefined, 
            arVariant: getMeaningVariant(ar),
        };

        return {...output, ...parsed};
    };

    const output = getOutput(parsedObj);

    return output;
}

module.exports = {resolveWord};