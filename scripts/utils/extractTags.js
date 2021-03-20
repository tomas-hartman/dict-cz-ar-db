/**
 * Extracts tags from array given regex matcher.
 * Should be used as part of extractTags.
 * @param {Array} arr Array with tags (split by " ")
 * @param {RegExp} matcher Used to 
 * @returns {Array} Note! This removes returned tags from original arr
 */
const extractAttributes = (arr, matcher) => {
    const idsToDelete = [];
    const output = arr.filter((tag, id) => {
        if(tag.match(matcher)){
            idsToDelete.push(id);
            return true;
        }
    });

    // reverse so I don't mess up with ids
    idsToDelete.reverse().forEach((id) => {
        arr.splice(id, 1);
    });

    return output;
};

/**
 * Sorts tags from given string with tags (divided by " ")
 * 
 * @param {String} tagsString 
 * @returns {Object} with categories (categories, stem, source, tags)
 */
const extractTags = (tagsString) => {
    const tagsArrToProccess = tagsString.split(' ');

    const output = {
        categoriesArr: extractAttributes(tagsArrToProccess, /^cat_/g),
        stemArr: extractAttributes(tagsArrToProccess, /_kmen$/g),
        sourceArr: extractAttributes(tagsArrToProccess, /^AR_|^text_|Hosnoviny|Ondrášoviny|slovnik_|^tema_/g),
        isDisabled: extractAttributes(tagsArrToProccess, /is_disabled/g),
        isExample: extractAttributes(tagsArrToProccess, /příklad/g),
        tagsArr: tagsArrToProccess, // rest of the tags that wasn't sorted out
    };

    return output;
};

module.exports = {extractTags};