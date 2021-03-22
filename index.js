// Funkce, kam pošlu název vstupního souboru a ono mi to vyanalyzuje výstup
// NEBO vytvoří csv

// Mělo by se pouštět přes CI a mělo by se ptát, co chco provést
// aby bylo univerzální, logy by se měly generovat do output/logs/__Filename__/__.txt

/**
 * Aktuální todo:
 * 
 * 1. rozparsovat ar na basic - plurál - stem vowel - masdar atd.
 * 2. připravit univezálnější logování
 */

const inquirer = require('inquirer');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const path = require('path');

const { analyze } = require('./scripts/analyze');
const transform = require('./scripts/transform');
// const { convert } = require('./scripts/convert');
const readfile = require('./scripts/readfile');
const convertAttrs = require('./scripts/convertAttrs/convertAttrs');
const { convertVocab } = require('./scripts/convertVocab/convertVocab');

if(argv._.length === 0) throw new Error('You must include path to raw data file first');

const [pathToFile] = argv._;

const question = [
    {
        type: 'list',
        name: 'action',
        message: 'What action do you want to perform?',
        choices: ['Analyze', 'Extract attributes', 'Convert attributes', 'Convert vocabulary', 'Drop vocabulary']
    }
];

inquirer.prompt(question).then((answers) => {
    const {action} = answers;
    const filename = path.join(process.cwd(), pathToFile);
    try {
        if(filename){
            switch (action) {
            case 'Analyze':
                analyze(filename);
                break;
            case 'Extract attributes':
                transform(filename);
                break;
            case 'Convert attributes':
                convertAttrs(filename);
                break;
            case 'Convert vocabulary':
                convertVocab(filename);
                break;
            case 'Drop vocabulary':
                // convertVocab(filename);
                break;
            default:
                console.log('Nothing...');
                break;
            }
        }
    } catch (err) {
        console.error(err);
    }
});


