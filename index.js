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
const prepare = require('./scripts/prepare');

if(argv._.length === 0) throw new Error('You must include path to raw data file first');

const [pathToFile] = argv._;

const question = [
    {
        type: 'list',
        name: 'action',
        message: 'What action do you want to perform?',
        choices: ['Analyze', 'Prepare', 'Transform']
    }
];

inquirer.prompt(question).then((answers) => {
    const {action} = answers;
    const filename = path.join(process.cwd(), pathToFile);

    if(filename){
        switch (action) {
        case 'Analyze':
            analyze(filename);
            break;
        case 'Prepare':
            prepare(filename);
            break;
        case 'Transform':
            console.log('Nothing yet');
            break;
        default:
            console.log('Nothing...');
            break;
        }
    }
});


