/**
 * Transforms proccessed output into csv formatted output ready to be imported into db
 */
const fs = require('fs');
const path = require('path');
const readfile = require('../readfile');
const ObjectsToCsv = require('objects-to-csv');
const convertToNormTranscription = require('./convertToNormTransctiption');
 
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
        disabled: 'false', // @todo: tag: is-disabled
        stem: transformToJson(outputStem),
    };
 
    return output;
}
 
// const a = "AR_1.rocnik AR_muj_slovnicek_1 lidé opakovani_zapomenutych profese substantiva";
// const b = "AR_lekce_3 AR_muj_slovnicek_1 III_kmen slovesa";
 
async function convertFile(data, outputStream) {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;
 
    const rootId = getId(root, roots);
    const {tags: _tags, category, source, disabled, stem} = resolveTags(tags);
    const normTranscription = convertToNormTranscription(transcription, root);
    // resolveAr() // checks data for plural, masdar, stem_vowel
 
    const output = {
        ar,
        cz,
        norm: '',
        cat_id: category,
        root_id: rootId,
        stem: stem,
        stem_vowel: null,
        plural: null,
        masdar: null,
        val,
        transcription: normTranscription,
        meaning_variant: null,
        synonyms_ids: syn,
        tags_ids: _tags,
        examples_ids: example, // todo
        source_ids: source,
        disabled,
    };
 
    // console.log();
    const csvOutput = await new ObjectsToCsv([output]).toString(false);
 
    // console.log(csvOutput)
    outputStream.write(csvOutput);
 
    // console.log(output)
}
 
const outputKeys = {
    ar: null,
    cz: null,
    norm: null,
    cat_id: null,
    root_id: null,
    stem: null,
    stem_vowel: null,
    plural: null,
    masdar: null,
    val: null,
    transcription: null, 
    meaning_variant: null,
    synonyms_ids: null,
    tags_ids: null,
    examples_ids: null, // todo
    source_ids: null,
    disabled: null,
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
 