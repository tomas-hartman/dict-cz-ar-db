const path = require('path');
const readfile = require('./readfile');
const createOutputStream = require('./utils/createOutputStream');

const inputFileName = path.resolve(__dirname, '../raw/Arabi__01__rocnik.txt');
const outputStream = createOutputStream('../output/', 'tags.txt');

const uniqueValues = new Set();
const uniqueCategories = new Set();
const uniqueStems = new Set();
const uniqueSources = new Set();

/**
 * @param {*} data 
 * @param {*} dataStream 
 */
function sortTagsIntoCategories(data, dataStream = outputStream) {
    const [_ar, _val, _cz, _root, _syn, _example, _transcription, tags] = data;
    const regexCat = /^cat_/g;
    const regexStems = /_kmen$/g;
    const regexSources = /^AR_|^text_|Hosnoviny|Ondrášoviny|slovnik_|^tema_/g;

    tags.split(' ').forEach((tag) => {
        if(tag.match(regexCat)){
            uniqueCategories.add(tag);
        } else if(tag.match(regexStems)) {
            uniqueStems.add(tag);
        } else if(tag.match(regexSources)){
            uniqueSources.add(tag);
        } else if(!uniqueValues.has(tag)){
            uniqueValues.add(tag);
            // dataStream.write(tag + "\n");
        }
    });
}

/**
 * Generates files for each category of tags 
 * @param {*} outputName 
 * @param {*} setOfValues 
 */
const generateOutputFromSet = (outputName, setOfValues) => {
    const outputStream = createOutputStream('../output/', `${outputName}.txt`);

    const sortedSet = Array.from(setOfValues).sort();

    sortedSet.forEach((item) => {
        outputStream.write(item + '\n');
    });
};

async function getTags() {
    await readfile(inputFileName, sortTagsIntoCategories);

    generateOutputFromSet('categories', uniqueCategories);
    generateOutputFromSet('sources', uniqueSources);
    generateOutputFromSet('stems', uniqueStems);
    generateOutputFromSet('tags', uniqueValues);
}

module.exports = {sortTags: sortTagsIntoCategories, getTags};
