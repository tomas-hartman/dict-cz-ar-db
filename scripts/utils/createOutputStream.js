const fs = require('fs');
const path = require('path');

const createOutputStream = (outputPath, filename) => {
    const outputFileName = path.resolve(__dirname, outputPath, filename);
    const writeStreamCharErrors = fs.createWriteStream(outputFileName);

    return writeStreamCharErrors;
};

module.exports = createOutputStream;