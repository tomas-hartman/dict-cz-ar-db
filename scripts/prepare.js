const path = require('path');
const getRoots = require('./getRootsList');
const {getTags} = require('./getTags');
const readfile = require('./readfile');

const inputFileName = path.resolve(__dirname, '../raw/Arabi__01__rocnik.txt');

const prepare = () => {
    // Write file with roots
    readfile(inputFileName, getRoots);
    
    // Prepare data from tags
    getTags();
};

// Todo
prepare();

module.exports = prepare;

