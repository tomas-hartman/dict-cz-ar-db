const { getCategories } = require('../utils/getCategory');
const { getStem } = require('../utils/getStem');


function parseFirstStem(data, regexes) {
    const [ar, _val, cz, ..._args] = data;
    const cleanedAr = cleanWord(ar, regexes);

    const splitForm = cleanedAr.split(' ');

    /**
     * Slovo o 2-3 segmentech
     * Forma: word (vowel) masdar | word (vowel)
     * @todo fixnout vowel a odstranit závorky
     */
    if(splitForm.length > 1 && splitForm.length < 4 ){
        const [word, vowel, masdar] = splitForm;

        const output = {
            word, vowel, masdar
        };

        return output;
    }
    
    /**
     * Inkorektní forma I_kmene, která se musí fixnout, až na výjimky (např. wulida)
     * Forma: word
     * @todo má se vytvořit, ale zobrazit upozornění
     */
    if(splitForm.length === 1) {
        console.warn('Warning:', ar, cz);

        const output = {
            word: ar, 
            vowel: undefined, 
            masdar: undefined
        };

        return output;
    } 
    
    // Possibly risky I_kmen
    // @todo Tady by mělo být nějaký obecnější __else__
    const filteredMap = (item) => {
        const output = item.trim();
            
        return output;
    };

    const [word, vowel, masdar] = cleanedAr.split(regexes.regexWordThreeSegments).filter((item) => item && item !== '').map(filteredMap);

    const output = {
        word, vowel, masdar
    };

    return output;
}

function parseExtendedStems(data, regexes) {
    const [ar, ..._args] = data;
    const cleanedAr = cleanWord(ar, regexes);
    const hasCorrectMasdars = cleanedAr.split(' ').length === 2 && cleanedAr.match(/(\([^,\u0640]+?\))/g);

    /**
     * Jednoslovné
     * Forma: word
     */
    if(cleanedAr.split(' ').length === 1){
        const output = {
            word: ar,
            vowel: undefined,
            masdar: undefined
        };

        return output;
    }  
    
    /** 
     * Jiný kmen než 1., víceslovný výraz 
     * Forma: sloveso (masdar)
     */
    if(hasCorrectMasdars){
        const [word, masdar] = cleanedAr.split(regexes.regexWordInParentheses).filter((item) => item !== '');
            
        const output = {
            word,
            vowel: undefined,
            masdar,
        };
            
        return output;
    } 
    
    /**
     * Víceslovné výrazy pro kmen > I_kmen
     * Forma: ??? - nevalidní
     */
    console.warn('Error:\t', data.join('\t'));
}

/**
 * Strips out variant information from input words: {1} or (1)
 * @param {String} word 
 * @returns String
 */
function cleanWord(word, regexes) {
    const output = word.replace(regexes.regexVariants, '').trim();

    return output;
}

// Refactor! Mísí se zde analýza s transformem!
/**
 * 
 * @param {*} data 
 * @param {*} outputStream 
 * @returns {object} {word, vowel, masdar}
 */
function parseVerb(data, outputStream) {
    const [_ar, _val, _cz, _root, _syn, _example, _transcription, tags] = data;

    const categories = getCategories(tags);
    const stem = getStem(tags);

    const regexes = {
        regexVariants: /\{\d\}|\(\d\)/g,
        regexWordInParentheses: /([\u0620-\u065f]+?)\s\(([\u0620-\u065f]+?)\)/g,
        regexWordThreeSegments: /(.+?)\((.+?)\)(.+)?/g, // word (vowel) masdar +++?
    };

    const isVerb = categories.includes('cat_slovesa');
    const isFirstStem = stem[0] === 'I_kmen';
    const isFourConsonant = stem[0] && stem[0].includes('4_');

    if(!isVerb || categories.length > 1) return;

    /**
     * I_kmen nebo undefined
     * jiný kmen, pokud má více než 1 slovo
     * jiný kmen, pokud má jedno slovo
     * I_kmen bez kořene apod.
     */
    if(isFourConsonant){
        /**
         * @todo dodělat support pro 4-konsonantní slovesa
         */
        console.log('This werb is four consonant.');
    } else if(!isFirstStem){
        const output = parseExtendedStems(data, regexes);

        console.log(output);
    } else if(isFirstStem) {
        const output = parseFirstStem(data, regexes);

        console.log(output);
    } else {
        console.log('Error, something is wrong:\t', data.join('\t'));
    }
}

module.exports = {parseVerb};
