const fs = require('fs');
const path = require('path');

const checkDirAvailability = (outputFilePath) => {
    const outputDirPath = path.parse(outputFilePath).dir;
    
    if (!fs.existsSync(outputDirPath)){
        fs.mkdirSync(outputDirPath);
    }
};

const createOutputStream = (outputPath, filename, sourceFilename) => {
    if(outputPath.includes('/logs') && !sourceFilename) throw 'Error! Analyze logs must always include sourceFilename!';

    let outputFileName = path.resolve(__dirname, outputPath, filename);

    if(sourceFilename){
        const logFolderName = path.parse(sourceFilename).name;
        outputFileName = path.resolve(__dirname, outputPath, logFolderName, filename);
    }
    
    checkDirAvailability(outputFileName);

    const writeStreamCharErrors = fs.createWriteStream(outputFileName);
    return writeStreamCharErrors;
};

module.exports = createOutputStream;