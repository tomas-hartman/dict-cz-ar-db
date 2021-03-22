const { getCategories } = require('../utils/getCategories');
const { getStem } = require('../utils/getStem');
const { cleanWord } = require('../utils/removeParenthesesFromAr');

function analyzeVerbs(data, dataStream) {
    const [ar, _val, _cz, _root, _syn, _example, _transcription, tags] = data;

    const categories = getCategories(tags);
    const stem = getStem(tags);

    const regexes = {
        regexVariants: /\{\d\}|\(\d\)/g,
    };

    const cleanedAr = cleanWord(ar, regexes);

    const isVerb = categories.includes('cat_slovesa');
    const isFirstStem = stem[0] === 'I_kmen';
    const isFourConsonant = stem[0] && stem[0].includes('4_');

    /** Pokud není sloveso, nezajímá mě to */
    if(!isVerb) return;

    /** Sloveso by mělo mít právě jednu kategorii */
    if(categories.length > 1) {
        dataStream.write('Warn: Verb has more categories:\t' + data.join('\t') + '\n');
        return;
    }
    
    /** Sloveso musí mít kmen */
    if(stem.length > 1 || stem.length < 1 || !stem){
        dataStream.write('Error: Stem is not specified:\t' + data.join('\t') + '\n');
        return;
    }

    /** 
     * Rozšířené kmeny 
     * 
     * - rozšířené kmeny s víceslovným popisem
     */
    if(!isFirstStem && !isFourConsonant) {
        /**
         * @todo: vyřadit ty, které mají správně masdary
        */

        const hasCorrectMasdars = cleanedAr.split(' ').length === 2 && cleanedAr.match(/(\([^,\u0640]+?\))/g);

        if(cleanedAr.split(' ').length > 1 && !hasCorrectMasdars){
            dataStream.write('Warn: Verb definition suspicious:\t' + data.join('\t') + '\n');
            return;
        }
    }

    /** 
     * I_kmen 
     * 
     * - I_kmen, který má jenom jedno slovo (chybí mu kmenová hláska)
     * - I_kmen, který nemá kmenovou hlásku v závorkách
     * - I_kmen, který má v závorce i masdar 
     */
    if(isFirstStem){
        if(cleanedAr.split(' ').length < 2){
            dataStream.write('Error: Verb definition incomplete:\t' + data.join('\t') + '\n');
            return;
        }

        // I_kmen, který nemá kmenovou hlásku v závorkách
        // forma: word __ masdar
        if(!cleanedAr.match(/(\(.+?\))/g)){
            // do stg
            dataStream.write('Error: Verb vowel is not in parentheses:\t' + data.join('\t') + '\n');
            return;
        }
        
        // I_kmen, který má v závorce i masdar
        if(cleanedAr.match(/(\(.+?[,\u060c/].+?\))/g)){
            dataStream.write('Error: Incorrect form inside parentheses:\t' + data.join('\t') + '\n');
            return;
        }
    }

    // Čtyřkonsonantní
    if(isFourConsonant){
        dataStream.write('Warn: Check 4-cons verbs manually:\t' + data.join('\t') + '\n');
        return;
    }

    /**
     * Co testuju:
     * 
     * @todo ? slovesa, která mají ve slově / nebo ,
     * @todo support pro 4-kons
     */

    // if (/** true */) {
    //     dataStream.write(data.join('\t') + '\n');

    //     return [root, data.join('\t')];
    // }
}

module.exports = { analyzeVerbs };