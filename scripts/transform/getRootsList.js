const uniqueRoots = new Set();

/**
 * Returns list of roots
 * @param {*} data 
 * @param {*} dataStream 
 */
function getRoots(data, dataStream) {
    const [_ar, _val, _cz, root, ..._args] = data;

    if(!uniqueRoots.has(root)){
        uniqueRoots.add(root);
        dataStream.write(root + '\n');
    }
}

module.exports = {getRoots};
