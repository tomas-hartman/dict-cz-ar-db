// Aby bylo univerzální, logy by se měly generovat do output/logs/__Filename__/__.txt

/**
 * Aktuální todo:
 * 
 * 1. rozparsovat ar na basic - plurál - stem vowel - masdar atd.
 * 2. připravit univezálnější logování
 */

const inquirer = require('inquirer');
const path = require('path');

const { analyze } = require('./scripts/analyze');
const transform = require('./scripts/transform');
// const { convert } = require('./scripts/convert');
const readfile = require('./scripts/readfile');
const convertAttrs = require('./scripts/convertAttrs/convertAttrs');
const { convertVocab } = require('./scripts/convertVocab/convertVocab');
const { resetAll } = require('./scripts/reset/reset');

const question = [
    {
        type: 'fuzzypath',
        name: 'raw',
        itemType: 'file',
        rootPath: 'raw',
        message: 'Select raw file:',
        default: 'Skip',
        depthLimit: 0,
    },
    {
        type: 'list',
        name: 'action',
        message: 'What action do you want to perform?',
        choices: ['Quit', 'Analyze', 'Extract attributes', 'Convert attributes & vocabulary', 'Reset database'],
        when: (answers) => answers.raw !== 'Skip' 
    },
    {
        type: 'list',
        name: 'action',
        message: 'What action do you want to perform?',
        choices: ['Quit', 'Reset database'],
        when: (answers) => answers.raw === 'Skip' 
    },
];

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));
inquirer.prompt(question).then((answers) => {
    const {raw, action} = answers;
    const filename = path.join(process.cwd(), raw);
    try {
        if(filename){
            switch (action) {
            case 'Analyze':
                analyze(filename);
                console.log('Analyzation finished.');
                break;
            case 'Extract attributes':
                transform(filename);
                console.log('Attributes extracted to separate files.');
                break;
            case 'Convert attributes & vocabulary':
                convertAttrs(filename);
                convertVocab(filename);
                console.log('Attributes and vocabulary converted into db.');
                break;
            case 'Reset database':
                resetAll();
                break;
            case 'Quit': 
                console.log('Application was terminated.');
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


