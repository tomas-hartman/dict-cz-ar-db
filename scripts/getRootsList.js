const fs = require('fs');
const path = require('path');
const readfile = require('./readfile');

const outputFileName = path.resolve(__dirname, '../output/roots.txt');
const inputFileName = path.resolve(__dirname, '../raw/Arabi__01__rocnik.txt');

const writeStream = fs.createWriteStream(outputFileName);

const uniqueRoots = new Set();

/**
 * Returns list of roots
 * @param {*} data 
 * @param {*} dataStream 
 */
function getRoots(data, dataStream = writeStream) {
    const [ar, val, cz, root, ...args] = data;

    if(!uniqueRoots.has(root)){
        uniqueRoots.add(root);
        dataStream.write(root + '\n');
    }
}

// Write file with roots
readfile(inputFileName, getRoots);

console.log(uniqueRoots);


module.exports = getRoots;



