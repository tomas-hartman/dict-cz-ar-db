const fs = require("fs");
const normalizeAr = require("./normalize/normalizeAr");
const readfile = require("./readfile");

const filename = path.resolve(__dirname, "../raw/Arabi__01__rocnik.txt");
const outputFileName = path.resolve(__dirname, "../output/logs/log_normalized.txt");
const writeStreamNormalized = fs.createWriteStream(outputFileName);


function logNormalizedData(data, dataStream = writeStreamNormalized) {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    const normalized = normalizeAr(ar);
    // const output = ar + " => " + normalized + "\n";
    const output = normalized + "\n";

    dataStream.write(output);
}

readfile(filename, logNormalizedData);
