const { getCategories } = require('../utils/getCategory');
const { getStem } = require('../utils/getStem');

// Refactor! Mísí se zde analýza s transformem!
/**
 * 
 * @param {*} data 
 * @param {*} outputStream 
 * @returns {object} {word, vowel, masdar}
 */
function parseVerb(data, outputStream) {

    // const regex = /[\u0041-\u007a]/g;
    const [ar, val, _cz, _root, _syn, _example, _transcription, tags] = data;

    const categories = getCategories(tags);
    const [stem] = getStem(tags);

    if (categories.length === 1 && categories.includes('cat_slovesa')) {
        // console.log(ar);
        // console.log(stem);
        // outputStream.write(data.join('\t') + '\n');

        /**
         * I_kmen nebo undefined
         * jiný kmen, pokud má více než 1 slovo
         * jiný kmen, pokud má jedno slovo
         * I_kmen bez kořene apod.
         */
        // const regex = /[({1-9})]/g;
        const regexVariants = /\{\d\}|\(\d\)/g;
        const regexWordInParentheses = /([\u0620-\u065f]+?)\s\(([\u0620-\u065f]+?)\)/g;
        const regexWordThreeSegments = /(.+?)\((.+?)\)(.+)?/g; // word (vowel) masdar +++?

        const strippedAr = ar.replace(regexVariants, '').trim();

        /**
         * Stem !== I_kmen : Stem === I_kmen
         */
        if(stem !== 'I_kmen'){
            if(strippedAr.split(' ').length === 1){
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
            } else if(strippedAr.match(regexWordInParentheses)){
                /** 
                 * Jiný kmen než 1., víceslovný výraz 
                 * Forma: sloveso (masdar)
                 */
                const [word, masdar] = strippedAr.split(regexWordInParentheses).filter((item) => item !== '');
                    
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
                console.warn('Warning:', ar, _cz);
            }
            
        } else if(stem === 'I_kmen') {
            const splitForm = strippedAr.split(' ');
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
                 * Inkorektní forma I_kmene, která se musí fixnout
                 * Forma: word
                 */
                console.warn('Warning:', ar, _cz);
            } else {
                // Possibly risky I_kmen
                // @todo Tady by mělo být nějaký obecnější __else__
                const filteredMap = (item) => {
                    const output = item.trim();
                        
                    return output;
                };

                const [word, vowel, masdar] = strippedAr.split(regexWordThreeSegments).filter((item) => item && item !== '').map(filteredMap);

                const output = {
                    word, vowel, masdar
                };

                console.log(output);
            } 
        } else {
            console.log('Error, stem is wierd');
        }

        return [val, data.join('\t')];
    }
}

module.exports = {parseVerb};
