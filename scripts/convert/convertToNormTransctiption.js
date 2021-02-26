const conversionTable = require('./conversionTable');
const readfile = require('../readfile');
const path = require('path');
const fs = require('fs');

const outputFileName = path.resolve(__dirname, '../../output/logs/warning_transcription_interdentals.txt');
const outputStream = fs.createWriteStream(outputFileName);

const getInterdentalsInRoot = (root) => {
    const rootArr = root.split('-');

    return rootArr.filter((radical) => {
        return radical === 'th' || radical === 'dh';
    });
};

const convertToNormTranscription = (text, root) => {
    let output = '';

    if(text === '') return null;
    
    const replacer = (substr, p1, origin) => {
        // Upozornění, kdyby došlo k rizikové transkripci
        if(substr === 'th' || substr === 'dh') outputStream.write(origin + '\n');

        const output = conversionTable[substr];

        // Kdyby se narazilo na znak, který není v tabulce
        if(output === undefined) console.log(substr);

        return output;
    };

    // check root, if it has dh, th, pokud ne, konvert normálně
    if(root && getInterdentalsInRoot(root).length === 0){
        const regex = /dž|ch|[áíúSTDZH372Rž']/g;
        output = text.replace(regex, replacer);
    } else {
        const regex = /dh|th|dž|ch|[áíúSTDZH372Rž']/g;
        output = text.replace(regex, replacer);
    }

    return output;
};

const convertWrapperCb = (data) => {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    if(transcription === '') return;

    const output = convertToNormTranscription(transcription, root);

    console.log(output);
};

// const file = path.join(__dirname, "../../output/roots.txt");
// const file = path.join(__dirname, "../../raw/Arabi__01__rocnik.txt");

// readfile(file, convertRoot);
// readfile(file, convertWrapperCb);

module.exports = convertToNormTranscription;