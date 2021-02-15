const fs = require("fs");
const path = require("path");
const readfile = require("./readfile");

const filename = path.resolve(__dirname, "../raw/Arabi__01__rocnik.txt");
const writeStream = fs.createWriteStream('./roots.txt');

const uniqueRoots = new Set();

function getRoots(data, dataStream = writeStream) {
    const [ar, val, cz, root, ...args] = data;

    if(!uniqueRoots.has(root)){
        uniqueRoots.add(root);
        dataStream.write(root + "\n");
    }
}

// Write file with roots
readfile(filename, getRoots);

console.log(uniqueRoots)


module.exports = getRoots;



