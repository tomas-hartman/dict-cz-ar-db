const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const path = require('path');
const readfile = require('./readfile');

const [pathToFile] = argv._;

const file = path.join(process.cwd(), pathToFile);
const prop = argv.prop;

/**
 * Function that reads file and returns given values into into console
 * @param {string} data file line
 * @param {string} prop enum(ar, val, cz, root, syn, example, transcription, tags)
 * @usage node readfileCI.js __fileName__
 */
const propCb = (data, prop) => {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    const vals = {
        ar, val, cz, root, syn, example, transcription, tags
    };

    vals[prop] !== '' && console.log(vals[prop]);
};


if(file && prop) readfile(file, (data) => propCb(data, prop));

console.log(argv);