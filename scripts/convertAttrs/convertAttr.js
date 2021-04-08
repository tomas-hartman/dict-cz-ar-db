const readfile = require('../readfile');
const path = require('path');

const { db } = require('../dbconnect');

function transformFileLine(data, attrName) {
    const [attrValue] = data;

    const output = {
        description: undefined,
        isDisabled: 0,
    };

    output[attrName] = attrValue;

    return output;
}

function convertAttrToDb(inputFile, attrName, tableName, importerCb) {
    const dirName = path.parse(inputFile).name;
    const dataFile = path.resolve(__dirname, '../../output', dirName, tableName + '.txt');

    readfile(dataFile, async (data) => {
        const outputRowObj = transformFileLine(data, attrName);
        
        importerCb(db, tableName, await outputRowObj);
    });
}

module.exports = {convertAttrToDb, transformFileLine};