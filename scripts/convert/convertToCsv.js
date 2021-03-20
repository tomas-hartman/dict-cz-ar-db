/**
 * Transforms proccessed output into csv formatted output ready to be imported into db
 */
const fs = require('fs');
const path = require('path');
const readfile = require('../readfile');
const ObjectsToCsv = require('objects-to-csv');
const convertToNormTranscription = require('./convertToNormTranscription');
const { parseVerb } = require('../transform/parseVerb');
const { parseNoun } = require('../transform/parseNoun');
 
const getValues = (name) => {
    const filePath = path.resolve(__dirname, '../../output/' + name + '.txt');
 
    return fs.readFileSync(filePath, 'utf8').split('\n');
};
 
const categories = getValues('categories');
const roots = getValues('roots');
const sources = getValues('sources');
const stems = getValues('stems');
const tags = getValues('tags');
 
const getId = (value, collection) => {
    const id = collection.findIndex((item) => item === value);
 
    if(id >= 0) {
        return id + 1;
    }
 
    return;
};

function transformToJson(array) {
    if(array.length > 0) return JSON.stringify(array);

    return '';
}
 
function getCleanVal(val) {
    let output = val.replace(/\u0640{2,}/g, 'ـ');

    return output;
}

function getBooleanRepresentation(value) {
    return value === true ? 1 : 0;
}

/**
  * Scans each word's tags and sorts them into an object based on information that is obtained from tags.
  * Replaces tags with their ids based on what's to be found in specific files generated in "prepare" step.
  * There is several informations taken from word's tags, such as category, stem, source etc.
  * @returns object with categorized information obtained from tags
  * @param {*} tagsString 
  */
function resolveTags(tagsString) {
    const tagsArr = tagsString.split(' ');
 
    const outputCategory = [];
    const outputStem = [];
    const outputSource = [];
    const outputTags = [];
 
    const _ = tagsArr.forEach((item) => {
        if(categories.find((category) => item === category)) {
            outputCategory.push(getId(item, categories));
            return false;
        }
 
        if(stems.find(stem => item === stem )){
            outputStem.push(getId(item, stems));
            return false;
        }
 
        if(sources.find(source => item === source )){
            outputSource.push(getId(item, sources));
            return false;
        }
         
        if(tags.find(tag => item === tag)){
            outputTags.push(getId(item, tags));
            return false;
        }
    });
 
    const output = {
        tags: transformToJson(outputTags),
        category: transformToJson(outputCategory),
        source: transformToJson(outputSource), // @todo
        isDisabled: 'false', // @todo: tag: is-disabled
        stem: transformToJson(outputStem),
    };
 
    return output;
}
 
// const a = "AR_1.rocnik AR_muj_slovnicek_1 lidé opakovani_zapomenutych profese substantiva";
// const b = "AR_lekce_3 AR_muj_slovnicek_1 III_kmen slovesa";
 
async function convertFile(data, outputStream) {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;
    const {tags: _tags, category, source, isDisabled, stem} = resolveTags(tags);

    const getMeaningVariant = (word) => {
        let match = word.match(/\(\d\)|{\d}/g);
        
        if(match){
            match.filter((item) => item !== '');
            match = match[0];
            match = match.replace(/\D/g, '');

            return match;
        }
    };

    const isVerb = categories.includes('cat_slovesa');
    const isNoun = categories.includes('cat_substantiva');
    const isExample = tags.includes('příklad');

    const verbalForms = isVerb && parseVerb(data);
    const nounForms = isNoun && parseNoun(data);

    const getTheWord = (ar, verbalForms, nounForms) => {
        if(verbalForms?.word) {
            return verbalForms.word;
        }

        if(nounForms?.word) {
            return nounForms.word;
        }

        return ar;
    };

    const normTranscription = convertToNormTranscription(transcription, root);
    const wordForm = getTheWord(ar, verbalForms, nounForms);

    const otherFormsObj = {
        word: wordForm,
        vowel: verbalForms?.vowel,
        masdar: verbalForms?.masdar,
        plural: nounForms?.plural
    };
 
    /**
     * ar, cz : basic forms
     * plural, masdar : derived forms
     * val, arVariant : props closely related to main word
     * norm, arTranscription : normalization
     * stem, stemVowel : stem
     * rootId, catIds, synonymsIds, tagsIds, exampleIds, sourceIds : interconnections
     * isDisabled, isExample : props
     */
    const output = {
        ar: wordForm,
        cs: cz,
        plural: otherFormsObj.plural,
        masdar: otherFormsObj.masdar,
        val: getCleanVal(val),
        arVariant: getMeaningVariant(ar),
        norm: '', // todo
        arTranscription: normTranscription,
        stem: stem,
        stemVowel: otherFormsObj.vowel,
        rootId: getId(root, roots),
        catIds: category,
        synonymsIds: syn,
        tagIds: _tags,
        exampleIds: example, // todo -- jaké examples k němu patří
        sourceIds: source,
        isDisabled: getBooleanRepresentation(isDisabled),
        isExample: getBooleanRepresentation(isExample), // todo - je samo o sobě example?
        tExample: example,
        tSynonym: syn,
    };
 
    const csvOutput = await new ObjectsToCsv([output]).toString(false);
 
    // console.log(csvOutput)
    outputStream.write(csvOutput);
}
 
const outputKeys = {
    ar: null,
    cs: null,
    plural: null,
    masdar: null,
    val: null,
    arVariant: null,
    norm: null,
    arTranscription: null,
    stem: null,
    stemVowel: null,
    rootId: null,
    catIds: null,
    synonymsIds: null,
    tagIds: null,
    exampleIds: null,
    sourceIds: null,
    isDisabled: null,
    isExample: null,
    tExample: null,
    tSynonym: null,
};
 
/**
  * Gathers all information and generates final csv file. 
  * @param {*} dataStream 
  */
const convertToCsv = (inputFile, dataStream) => {
    const firstLine = Object.keys(outputKeys).join(',');
    dataStream.write(firstLine + '\n');

    console.log(dataStream.path);
    readfile(inputFile, (data) => convertFile(data, dataStream));
};
 
// Todo
// convertToCsv();
 
module.exports = convertToCsv;
 