const { getCategories } = require('../utils/getCategory');
const { getStem } = require('../utils/getStem');


function parseFirstStem(data, regexes) {
    const [ar, _val, cz, ..._args] = data;
    const cleanedAr = cleanWord(ar, regexes);

    const splitForm = cleanedAr.split(' ');
    if(splitForm.length > 1 && splitForm.length < 4 ){
        /**
         * Slovo o 2-3 segmentech
         * Forma: word (vowel) masdar | word (vowel)
         * @todo fixnout vowel a odstranit závorky
         */
        const [word, vowel, masdar] = splitForm;

        const output = {
            word, vowel, masdar
        };

        console.log(output);
    } else if(splitForm.length === 1) {
        /**
         * Inkorektní forma I_kmene, která se musí fixnout, až na výjimky (např. wulida)
         * Forma: word
         * @todo má se vytvořit, ale zobrazit upozornění
         */
        console.warn('Warning:', ar, cz);
    } else {
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

        console.log(output);
    } 
}

function parseExtendedStems(data, regexes) {
    const [ar, _val, cz, ..._args] = data;
    const cleanedAr = cleanWord(ar, regexes);

    if(cleanedAr.split(' ').length === 1){
        /**
         * Jednoslovné
         * Forma: word
         */
        const output = {
            word: ar,
            vowel: undefined,
            masdar: undefined
        };

        console.log(output);
    } else if(cleanedAr.match(regexes.regexWordInParentheses)){
        /** 
         * Jiný kmen než 1., víceslovný výraz 
         * Forma: sloveso (masdar)
         */
        const [word, masdar] = cleanedAr.split(regexes.regexWordInParentheses).filter((item) => item !== '');
            
        const output = {
            word,
            masdar,
            vowel: undefined
        };
            
        console.log(output);
    } else {
        /**
         * Víceslovné výrazy pro kmen > I_kmen
         * Forma: ? - nevalidní
         */
        console.warn('Warning:', ar, cz);
    }
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
    const [stem] = getStem(tags);

    /**
     * @todo dodělat support pro 4-konsonantní slovesa
     */
    if (categories.length === 1 && categories.includes('cat_slovesa')) {
        /**
         * I_kmen nebo undefined
         * jiný kmen, pokud má více než 1 slovo
         * jiný kmen, pokud má jedno slovo
         * I_kmen bez kořene apod.
         */
        const regexes = {
            regexVariants: /\{\d\}|\(\d\)/g,
            regexWordInParentheses: /([\u0620-\u065f]+?)\s\(([\u0620-\u065f]+?)\)/g,
            regexWordThreeSegments: /(.+?)\((.+?)\)(.+)?/g, // word (vowel) masdar +++?
        };

        if(stem !== 'I_kmen'){
            parseExtendedStems(data, regexes);
        } else if(stem === 'I_kmen') {
            parseFirstStem(data, regexes);
        } else {
            console.log('Error, stem is wierd'); // => čtyřkonsonantní musí propadnout sem!
        }
    }
}

module.exports = {parseVerb};
