const fs = require('fs');
const path = require('path');

const checkAttrFilesExist = (inputFile) => {
    const files = ['categories', 'roots', 'sources', 'tags'];
    const inputFileNamespace = path.parse(inputFile).name;
    
    const filesExist = files.every((filenameSlug) => {
        const pathToFile = path.resolve(__dirname, '../../output', inputFileNamespace, filenameSlug + '.txt');

        return fs.existsSync(pathToFile);
    });

    return filesExist;
};

module.exports = { checkAttrFilesExist };