const fs = require("fs");
const readline = require('readline');

async function readfile(filename, cb) {
    // const roots = new Set();
    const rl = readline.createInterface({
        input: fs.createReadStream(filename),
    })

    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        // console.log(`Line from file: ${line}\n`);
        const fields = line.split("\t");

        // roots.add(root);
        if(cb) cb(fields);
    }
}

module.exports = readfile;