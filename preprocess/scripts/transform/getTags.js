const readfile = require('../readfile');
const { createOutputStream } = require('../utils');

const uniqueValues = new Set();
const uniqueCategories = new Set();
const uniqueStems = new Set();
const uniqueSources = new Set();

/**
 * @param {*} data 
 * @param {*} dataStream 
 */
function sortTagsIntoCategories(data, dataStream) {
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
            if(dataStream) {
                dataStream.write(tag + '\n');
            }
        }
    });
}

/**
 * Generates files for each category of tags 
 * @todo add possibility to just add new tags to already existing file!
 * @param {*} outputName 
 * @param {*} setOfValues 
 */
const generateOutputFromSet = (outputName, setOfValues, inputFilename) => {
    const outputStream = createOutputStream('../../output/', `${outputName}.txt`, inputFilename);

    const sortedSet = Array.from(setOfValues).sort();

    sortedSet.forEach((item) => {
        outputStream.write(item + '\n');
    });
};

/**
 * Creates lists of informations based on tags into separate files.
 * This information is then used as reference in transform.
 */
async function getTags(inputFilename) {
    // Optionally feed sortTagsIntoCategories() with this to output this file
    // const outputTags = createOutputStream('../../output/', 'tags_unsorted.txt');
    await readfile(inputFilename, (data) => sortTagsIntoCategories(data));

    generateOutputFromSet('categories', uniqueCategories, inputFilename);
    generateOutputFromSet('sources', uniqueSources, inputFilename);
    generateOutputFromSet('stems', uniqueStems, inputFilename);
    generateOutputFromSet('tags', uniqueValues, inputFilename);
}

module.exports = {sortTags: sortTagsIntoCategories, getTags};
