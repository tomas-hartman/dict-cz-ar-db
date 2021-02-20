const fs = require("fs");
const path = require("path");
const readfile = require("./readfile");

const outputFileName = path.resolve(__dirname, "../output/tags.txt");
const inputFileName = path.resolve(__dirname, "../raw/Arabi__01__rocnik.txt");

const writeStream = fs.createWriteStream(outputFileName);

const uniqueValues = new Set();
const uniqueCategories = new Set();
const uniqueStems = new Set();
const uniqueSources = new Set();

/**
 * Returns list of roots
 * @param {*} data 
 * @param {*} dataStream 
 */
function sortTags(data, dataStream = writeStream) {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;
    const regexCat = /^cat_/g;
    const regexStems = /_kmen$/g;
    const regexSources = /^AR_|^text_|Hosnoviny|Ondrášoviny|slovnik_/g;

    tags.split(" ").forEach((tag) => {
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

const getStream = (outputName) => {
    const outputFileName = path.resolve(__dirname, `../output/${outputName}.txt`);
    return fs.createWriteStream(outputFileName);
}

const generateOutput = (outputName, valuesSet) => {
    const outputStream = getStream(outputName);

    const sortedSet = Array.from(valuesSet).sort();

    sortedSet.forEach((item) => {
        outputStream.write(item + "\n");
    });
}

async function getTags() {
    // Write file with roots
    await readfile(inputFileName, sortTags);

    generateOutput("categories", uniqueCategories);
    generateOutput("sources", uniqueSources);
    generateOutput("stems", uniqueStems);
    generateOutput("tags", uniqueValues);

}

getTags();


module.exports = sortTags;



