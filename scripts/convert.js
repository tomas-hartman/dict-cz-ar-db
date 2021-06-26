const { convertAttrs } = require('./convertAttrs/convertAttrs');
const { convertVocab } = require('./convertVocab/convertVocab');

const convert = async (filename) => {
    await convertAttrs(filename);
    await convertVocab(filename);
};

module.exports = {convert};