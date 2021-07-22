// Aby bylo univerzální, logy by se měly generovat do output/logs/__Filename__/__.txt

/**
 * Aktuální todo:
 * 
 * 1. rozparsovat ar na basic - plurál - stem vowel - masdar atd.
 * 2. připravit univezálnější logování
 */

const inquirer = require('inquirer');
const path = require('path');

const { analyze } = require('./preprocess/scripts/analyze');
const { transform } = require('./preprocess/scripts/transform');
const { convert } = require('./preprocess/scripts/convert');
const { resetAll } = require('./preprocess/scripts/reset/reset');

const question = [
    {
        type: 'fuzzypath',
        name: 'raw',
        itemType: 'file',
        rootPath: 'preprocess/raw',
        message: 'Select raw file:',
        default: 'Skip',
        depthLimit: 0,
    },
    {
        type: 'list',
        name: 'action',
        message: 'What action do you want to perform?',
        choices: ['Quit', 'Analyze', 'Extract attributes', 'Convert attributes & vocabulary into DB', 'Reset database'],
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
                console.log(`Analyzation finished. You can find output in 'preprocess/output/logs/${path.parse(filename).name}'`);
                break;
            case 'Extract attributes':
                transform(filename);
                console.log(`Attributes extracted to separate files. You can find output in 'preprocess/output/${path.parse(filename).name}'`);
                break;
            case 'Convert attributes & vocabulary into DB':
                convert(filename);
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
