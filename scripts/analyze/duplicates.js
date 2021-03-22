const readfile = require('../readfile');
const crypto = require('crypto');
const {getCategories} = require('../utils/getCategories');

const normalizeAr = require('../normalize/normalizeAr');

const chunks = new Set(); // referenční string, na základě něhož se pozná, zda je slovo unikátní; neobsahuje data
const references = {};
const categorizedReferencedData = {}; // data
const ignored = [
    'ات',
    'في',
    'إلى',
    'على',
    'من',
    'عن',
    'ون',
    'أن',
];

/**
 * Analyzes data and then 1) store it into global var chunksStore, 2) [optionally] output them
 * Or: 1) try to find deep duplicities (checks each word segment of each phrase). Not so accurate.
 * 
 * @todo najs to have: checkovat duplicity dvoufázově: první článek ze slovíček (obvykle hlavní slovo) + celé spojení ze slovíček, deep duplicates je too much a je nepřesné
 * @param {Object} data 
 * @param {Boolean} deepDuplicates checks if any segment of the word is duplicate, otherwise checks full word duplicity deprecated
 * @param {Boolean} outputData writes data down to a file on its own. False by default
 * @param {WritableStream} dataStream 
 */
function analyzeDuplicates(data, deepDuplicates = false, outputData = false, dataStream) {
    const [ar, _val, _cz, _root, _syn, _example, _transcription, tags] = data;

    const normAr = normalizeAr(ar);
    const arChunks = normAr.split(' ');

    if(deepDuplicates) {
        for(let i = 0 ; i<arChunks.length; i++){
            const currentChunk = arChunks[i];
    
            if(!chunks.has(currentChunk) || ignored.includes(currentChunk)){
                chunks.add(currentChunk);
    
                continue;
            }
    
            outputData && dataStream.write(data.join('\t') + '\n');
            break;
        }
    } else {
        const rawCategories = getCategories(tags);
        const fixedCategory = rawCategories.length === 1 ? rawCategories[0] : undefined;

        const reference = crypto.createHash('md5').update(normAr).digest('hex');

        if(!references[reference]){
            // first occurencies of all words
            references[reference] = {normAr, category: fixedCategory};
            categorizedReferencedData[reference] = [data];
        } else {
            /**
             * Possible diplicates are processed below here!
             * 
             * In some of the occurencies there is a category missing, so we merge them,
             * because we can't tell whether the word is a duplicate or not.
             * Also make sure to "unlock" category in case other potentially duplicate word appears.
             * All look-alikes must have their category specified, otherwise they are treated as duplicates.
             */
            if(!fixedCategory || !references[reference].category){
                references[reference].category = undefined; // reset in case other uncategorized duplicates appear
                categorizedReferencedData[reference] = [data, ...categorizedReferencedData[reference]];

                if(outputData) dataStream.write(data.join('\t') + '\n');
            } else if(fixedCategory === references[reference].category){
                /** Quite possible duplicates with category */
                categorizedReferencedData[reference] = [data, ...categorizedReferencedData[reference]];

                if(outputData) dataStream.write(data.join('\t') + '\n');
            } 

            // else {
            //     console.log('\n');
            //     console.log('These might not be duplicates and should not have any undefined categories:');
            //     console.log('Already referenced word:', references[reference]);
            //     console.log('Current word:', {normAr, category: fixedCategory});
            // }
        }
    }
}

/**
 * Proccesses chunkStore and writes output.
 * @param {fs.WriteStream} outputStream 
 */
async function validateDuplicates(outputStream, inputFile) {
    const _output = await readfile(inputFile, (data) => analyzeDuplicates(data, false));

    const writeOutput = (duplicatesObj) => {
        const _duplicities = Object.keys(duplicatesObj).map((data) => {
    
            if(duplicatesObj[data].length > 1){
    
                const outputArr = duplicatesObj[data].map((lineData) => {
                    // console.log(lineData.join("\t"))
                    const string = lineData.join('\t');
                    return string;
                });
    
                outputStream.write(outputArr.join('\n') + '\n\n');
                return outputArr.join('\n');
            }
        });
    };

    writeOutput(categorizedReferencedData);
}

/**
 * Deep duplicates (just for check)
 */
const analyzeDeepDuplicates = (inputFile) => {
    readfile(inputFile, (data) => analyzeDuplicates(data, true, true));
};

/**
 * Tři způsoby jak checkovat duplicity. Lepší je validateDuplicates(), protože vrací setřízený seznam duplicit vedle sebe.
 */
// readfile(filename, (data) => analyzeDuplicates(data, false, true));
// analyzeDeepDuplicates(); // deprecated, nejjednodušší a nejhrubší
// validateDuplicates(inputFileName); // preferred, nejpřehlednější, optimalizovanější

module.exports = {analyzeDuplicates: validateDuplicates, analyzeDeepDuplicates};