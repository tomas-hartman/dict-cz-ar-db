const { getRoots } = require('./transform/getRootsList');
const { getTags } = require('./transform/getTags');
const readfile = require('./readfile');
const createOutputStream = require('./utils/createOutputStream');

/**
 * Extract information from tags and generates separate list of roots.
 */
const prepare = (filename) => {
    // Write file with roots
    const outputRoots = createOutputStream('../../output/', 'roots.txt');
    readfile(filename, (data) => getRoots(data, outputRoots));
    
    // Prepare data from tags
    getTags(filename);
};

module.exports = prepare;

