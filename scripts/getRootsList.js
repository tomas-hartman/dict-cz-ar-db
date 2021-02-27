const createOutputStream = require('./utils/createOutputStream');
const writeStream = createOutputStream('../output/', 'roots.txt');

const uniqueRoots = new Set();

/**
 * Returns list of roots
 * @param {*} data 
 * @param {*} dataStream 
 */
function getRoots(data, dataStream = writeStream) {
    const [_ar, _val, _cz, root, ..._args] = data;

    if(!uniqueRoots.has(root)){
        uniqueRoots.add(root);
        dataStream.write(root + '\n');
    }
}

module.exports = getRoots;
