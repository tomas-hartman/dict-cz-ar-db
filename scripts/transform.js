/**
 * Transforms proccessed output into csv formatted output ready to be imported into db
 */
const fs = require('fs');
const path = require('path');
const readfile = require('./readfile');
const ObjectsToCsv = require('objects-to-csv');
const convertToNormTranscription = require('./convert/convertToNormTransctiption');

const filename = 'Arabi__01__rocnik';
const inputFileName = path.resolve(__dirname, '../raw/' + filename + '.txt');
const outputFileName = path.resolve(__dirname, '../output/' + filename + '__processed.csv');
const writeStream = fs.createWriteStream(outputFileName);


const getValues = (name) => {
    const filePath = path.resolve(__dirname, '../output/' + name + '.txt');

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
        tags: outputTags.join(' '),
        category: outputCategory.join(' '),
        source: outputSource.join(' '), // @todo
        disabled: 'false', // @todo: tag: is-disabled
        stem: outputStem.join(' '),
    };

    return output;
}

// const a = "AR_1.rocnik AR_muj_slovnicek_1 lidé opakovani_zapomenutych profese substantiva";
// const b = "AR_lekce_3 AR_muj_slovnicek_1 III_kmen slovesa";

// console.log(resolveTags(b));

async function convertFile(data) {
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
    writeStream.write(csvOutput);

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

const firstLine = Object.keys(outputKeys).join(',');
writeStream.write(firstLine + '\n');
readfile(inputFileName, convertFile);

