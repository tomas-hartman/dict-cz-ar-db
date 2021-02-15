const fs = require("fs");
const path = require("path");
const readfile = require("./readfile");

const filename = path.resolve(__dirname, "../raw/Arabi__01__rocnik.txt");
const writeStreamDuplicates = fs.createWriteStream('./duplicates.txt');
const normalizeAr = require("./normalizeAr");

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
 * @todo find a way to log all examples of given non-unique data
 * @param {*} data 
 * @param {*} deepDuplicates checks if any segment of the word is duplicate, otherwise checks full word duplicity
 * @param {*} dataStream 
 */
function analyzeDuplicates(data, deepDuplicates = false, dataStream = writeStreamDuplicates) {
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
    
            dataStream.write(data.join("\t") + "\n");
            break;
        }
    } else {
        const currentChunk = normAr;

        if(!chunks.has(currentChunk)){
            chunks.add(currentChunk);
            chunksStore[currentChunk] = [data];

            
        } else {
            chunksStore[currentChunk] = [data, ...chunksStore[currentChunk]];
            dataStream.write(data.join("\t") + "\n");
        }
    }

    // console.log(chunksStore)
    // console.log(Object.keys(chunksStore).filter((key) => key.length > 1))
}


/**
 * @todo find a way to read chunksStore and get all the relevant data from it after readfile is finished.
 */
readfile(filename, (data) => analyzeDuplicates(data, false));


