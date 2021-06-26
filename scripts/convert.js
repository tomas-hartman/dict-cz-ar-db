const { convertAttrs } = require('./convertAttrs/convertAttrs');
const { convertVocab } = require('./convertVocab/convertVocab');

/**
 * Converts attributes and vocabulary into table.
 * @todo Fix bug with result.id
 * @param {*} filename 
 */
const convert = async (filename) => {
    await convertAttrs(filename);
    await convertVocab(filename);
};

module.exports = {convert};