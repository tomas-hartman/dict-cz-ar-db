const { getCategories } = require('../utils/getCategory');

const regexes = {
    variants: /\{\d\}|\(\d\)/g,
    wordInParentheses: /([\u0620-\u065f]+?)\s\(([\u0620-\u065f]+?)\)/g,
    wordThreeSegments: /(.+?)\((.+?)\)(.+)?/g, // word (vowel) masdar +++?
    nounWithPlural: /(.+?)\s(\(.+?\))/g,
    dividedPlural: /[,/\u060c;]/g
};

function cleanWord(word, regex) {
    const output = word.replace(regex, '').trim();

    return output;
}

const cleanPlural = (rawPlural) => {
    let output = rawPlural.replace(/[()]/g, '');

    if(output.match(regexes.dividedPlural)){
        output = output.split(regexes.dividedPlural).filter((item) => item !== '').map((item) => item.trim());
        output = output.join(', ');
    }

    return output;
};

const parseNoun = (data) => {
    const [ar, _val, _cz, _root, _syn, _example, _transcription, tags] = data;

    const isNoun = getCategories(tags).includes('cat_substantiva');

    if(!isNoun) return {
        word: ar,
        plural: undefined
    };

    const cleanedAr = cleanWord(ar, regexes.variants);

    if(isNoun && cleanedAr.match(regexes.nounWithPlural)){
        const [singular, plural] = cleanedAr.split(regexes.nounWithPlural).filter((item) => item !== '');
        const cleanedPlural = cleanPlural(plural);

        const output = {
            ar: singular,
            plural: cleanedPlural
        };

        return output;
    }

};

module.exports = {parseNoun};