/**
 * Strips out variant information from input words: {1} or (1)
 * @param {String} word 
 * @returns String
 * @todo fix regex functionality: refactor
 */
function removeVariantInformation(word, regexes) {
    const output = word.replace(regexes.regexVariants, '').trim();

    return output;
}

module.exports = {removeVariantInformation};