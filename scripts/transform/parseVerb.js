const { getCategories } = require('../utils/getCategory');
const { getStem } = require('../utils/getStem');

function transformVowel(rawVowel) {
    if(!rawVowel) return;
    // Strip () a další nechtěný
    // strip prázdný taTwíl

    const charsToStrip = /[(),\u060c\s]/g;
    const vowelRegex = /(\u0640[\u064e-\u0650])/g;

    let output = rawVowel.normalize('NFD');
    output = output.replace(charsToStrip, '');
    output = output.split(vowelRegex);
    output = output.filter((item) => item !== '' && item !== 'ـ');
    
    return output.join(', ');
}

function parseFourConsonant(data, regexes) {
    const [ar, ..._args] = data;
    const cleanedAr = cleanWord(ar, regexes);

    const splitForm = cleanedAr.split(' ');

    const output = {
        ar: splitForm[0],
        stemVowel: transformVowel(splitForm[1]),
        masdar: undefined
    };

    return output;
}

function parseFirstStem(data, regexes) {
    const [ar, _val, cz, ..._args] = data;
    const cleanedAr = cleanWord(ar, regexes);

    const splitTwoFormsRegex = /(.+?)[\s](\(.+?\))$/g;
    const splitForm = cleanedAr.split(' ');

    /**
     * Slovo o 2 segmentech
     * Forma: word (vowel, full form) | word (vowel, masdar) -> tohle se odchytí v analyze
     */
    if(cleanedAr.match(splitTwoFormsRegex)) {
        const [ar, vowel] = cleanedAr.split(splitTwoFormsRegex).filter((item) => item !== '');

        const output = {
            ar, 
            stemVowel: transformVowel(vowel), 
            masdar: undefined
        };

        return output;
    }

    /**
     * Slovo o 3 segmentech
     * Forma: word (vowel) masdar
     */
    if(splitForm.length > 1 && splitForm.length < 4 ){
        const [word, vowel, masdar] = splitForm;

        const output = {
            ar: cleanWord(word, regexes), 
            stemVowel: transformVowel(vowel), 
            masdar
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
            ar: cleanedAr, 
            stemVowel: undefined, 
            masdar: undefined
        };

        return output;
    } 
    
    /**
     * Possibly risky I_kmen
     * Forma: (často) word (vowel) masdar, masdar | word (vowel, fullform) masdar
     * @todo druhá forma by mohla být součást upravenýho 3-segmentovýho parseru
     */

    const filteredMapCb = (item) => {
        const output = item.trim();
            
        return output;
    };

    const filteredCleanArArr = cleanedAr.split(regexes.regexWordThreeSegments).filter((item) => item && item !== '');
    const [word, vowel, masdar] = filteredCleanArArr.map(filteredMapCb);

    const output = {
        ar: word, 
        stemVowel: transformVowel(vowel), 
        masdar
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
            ar: cleanedAr,
            stemVowel: undefined,
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
            ar: word,
            stemVowel: undefined,
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

const regexes = {
    regexVariants: /\{\d\}|\(\d\)/g,
    regexWordInParentheses: /([\u0620-\u065f]+?)\s\(([\u0620-\u065f]+?)\)/g,
    regexWordThreeSegments: /(.+?)\((.+?)\)(.+)?/g, // word (vowel) masdar +++?
};

/**
 * 
 * @param {*} data 
 * @returns {object} {word, vowel, masdar}
 */
function parseVerb(data) {
    const [_ar, _val, _cz, _root, _syn, _example, _transcription, tags] = data;

    const categories = getCategories(tags);
    const stem = getStem(tags);

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
        console.log('This verb is four consonant.');
        const output = parseFourConsonant(data, regexes);

        // console.log(output);
        return output;
    } else if(!isFirstStem){
        const output = parseExtendedStems(data, regexes);

        // console.log(output);
        return output;
    } else if(isFirstStem) {
        const output = parseFirstStem(data, regexes);

        // console.log(output);
        return output;
    } else {
        console.log('Error, something is wrong:\t', data.join('\t'));
    }
}

module.exports = {parseVerb};
