/** @deprecated Not used anymore, might be archived */

const path = require('path');
const convertToCsv = require('./convert/convertToCsv');
const { createOutputStream } = require('./utils');

const convert = (filename) => {
    const outputFileNameChunk = path.parse(filename).name;

    // This must be the last step
    const csvOutputStream = createOutputStream('../../output/', outputFileNameChunk + '__processed.csv');
    convertToCsv(filename, csvOutputStream);
};

module.exports = {convert};