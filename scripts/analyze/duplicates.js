const fs = require("fs");
const path = require("path");
const readfile = require("../readfile");

const inputFileName = path.resolve(__dirname, "../../raw/Arabi__01__rocnik.txt");
const outputFileName = path.resolve(__dirname, "../../output/logs/duplicates.txt");

const writeStreamDuplicates = fs.createWriteStream(outputFileName);
const normalizeAr = require("../normalize/normalizeAr");

const chunks = new Set();
const chunksStore = {};
const ignored = [
    "ات",
    "في",
    "إلى",
    "على",
    "من",
    "عن",
    "ون",
    "أن",
]

/**
 * Analyzes data and then 1) store it into global var chunksStore, 2) [optionally] output them
 * Or: 1) try to find deep duplicities (checks each word segment of each phrase). Not so accurate.
 * 
 * @todo najs to have: checkovat duplicity dvoufázově: první článek ze slovíček (obvykle hlavní slovo) + celé spojení ze slovíček, deep duplicates je too much a je nepřesné
 * @param {*} data 
 * @param {*} deepDuplicates checks if any segment of the word is duplicate, otherwise checks full word duplicity
 * @param {*} outputData writes data down to a file on its own. False by default
 * @param {*} dataStream 
 */
function analyzeDuplicates(data, deepDuplicates = false, outputData = false, dataStream = writeStreamDuplicates) {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    const normAr = normalizeAr(ar);
    const arChunks = normAr.split(" ");

    if(deepDuplicates) {
        for(let i = 0 ; i<arChunks.length; i++){
            const currentChunk = arChunks[i];
    
            if(!chunks.has(currentChunk) || ignored.includes(currentChunk)){
                chunks.add(currentChunk);
    
                continue;
            }
    
            outputData && dataStream.write(data.join("\t") + "\n");
            break;
        }
    } else {
        const currentChunk = normAr;

        if(!chunks.has(currentChunk)){
            chunks.add(currentChunk);
            chunksStore[currentChunk] = [data];

            
        } else {
            chunksStore[currentChunk] = [data, ...chunksStore[currentChunk]];
            outputData && dataStream.write(data.join("\t") + "\n");
        }
    }
}

/**
 * Proccesses chunkStore and writes output.
 * @param {Boolean} writeOutput 
 * @param {fs.WriteStream} dataStream 
 */
async function proccessChunkStore(writeOutput = true, dataStream = writeStreamDuplicates) {
    const output = await readfile(inputFileName, (data) => analyzeDuplicates(data, false));

    const duplicities = Object.keys(chunksStore).map((data) => {

        if(chunksStore[data].length > 1){

            const outputArr = chunksStore[data].map((lineData) => {
                // console.log(lineData.join("\t"))
                const string = lineData.join("\t");
                return string;
            });

            dataStream.write(outputArr.join("\n") + "\n\n")
            return outputArr.join("\n");
        }
    });
}

/**
 * Deep duplicates (just for check)
 */
const analyzeDeepDuplicates = () => {
    readfile(inputFileName, (data) => analyzeDuplicates(data, true, true));
}

/**
 * Tři způsoby jak checkovat duplicity. Lepší je proccessChunkStore(), protože vrací setřízený seznam duplicit vedle sebe.
 */
// readfile(filename, (data) => analyzeDuplicates(data, false, true));
// analyzeDeepDuplicates();
// proccessChunkStore(); // preferred, nejpřehlednější

module.exports = {analyzeDuplicates: proccessChunkStore, analyzeDeepDuplicates};