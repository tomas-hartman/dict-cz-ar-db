const {Readable, Writable} = require("stream");
const fs = require("fs");
const readline = require('readline');
const path = require("path");

const filename = path.resolve(__dirname, "../raw/Arabi__01__rocnik.txt");
const writeStream = fs.createWriteStream('./roots.txt');
const writeStreamErrors = fs.createWriteStream('./errors.txt');

function checkRoots(data, dataStream = writeStreamErrors) {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    if(root.match(/\s|[?]/) || root.trim() === ""){
        dataStream.write(data.join("\t") + "\n");
    }
}

function writeRootsFile(data, dataStream = writeStream) {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    dataStream.write(root + "\n");
}

async function readfile(cb) {
    const roots = new Set();
    const rl = readline.createInterface({
        input: fs.createReadStream(filename),
        // output: fs.createWriteStream(writable)
    })

    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        // console.log(`Line from file: ${line}\n`);
        const fields = line.split("\t");

        // roots.add(root);
        if(cb) cb(fields);
      }

    console.log(roots);
}

// Check roots
readfile(checkRoots);

// Write file
// readfile(writeRootsFile);



