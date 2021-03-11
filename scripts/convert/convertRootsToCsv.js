const readfile = require('../readfile');
const path = require('path');
const ObjectsToCsv = require('objects-to-csv');
const createOutputStream = require('../utils/createOutputStream');
const convertToNormTranscription = require('./convertToNormTranscription');

const inputFile = '../../output/roots.txt';
const outputDataStream = createOutputStream('../../output', 'roots.csv');
const {conversionTableToAr} = require('./conversionTableToAr');



/**
 * @todo přepsat a líp logicky uspořádat
 * @todo přidat upozornění na chyby
 * @param {*} data 
 * @param {*} outputStream 
 */
async function convertRootFile(data, outputStream) {
    const [root] = data;

    const getTranscription = (root) => {
        let transcription = root.split('-');

        transcription = transcription.map((consonant) => {
            const output = convertToNormTranscription(consonant);

            return output;
        });

        return transcription.join('');
    };

    const getAr = (normTransctiption) => {
        let output = normTransctiption.split('');

        output = output.map((char) => {
            return conversionTableToAr[char];
        });

        return output.join('');
    };

    const getOutput = () => {
        /**
         * @todo tohle má vyhodit analyze error
         * @todo kořen může být i dh, h nebo ka
         */
        if(!root.match(/[-]/g) || root.split(' ').length > 1){
            console.log(root);
    
            return {
                origin: root,
                transcription: undefined,
                arabic: undefined
            };
        }
    
        const transcribedRoot = getTranscription(root);

        return {
            origin: root,
            transcription: transcribedRoot,
            arabic: getAr(transcribedRoot)
        };
    };

    const output = getOutput();
    const csvOutput = await new ObjectsToCsv([output]).toString(false);
 
    outputStream.write(csvOutput);
}

function convertRootsToCsv(inputFile, dataStream) {
    // Example + key display
    const outputObj = {
        origin: 'k-t-b',
        transcription: 'ktb',
        arabic: 'كتب'
    };

    const firstLine = Object.keys(outputObj).join(',');

    dataStream.write(firstLine + '\n');

    readfile(inputFile, (data) => convertRootFile(data, dataStream));
}

convertRootsToCsv(path.resolve(__dirname, inputFile), outputDataStream);