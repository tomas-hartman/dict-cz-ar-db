const { convertToNormTranscription } = require('../convert/convertToNormTranscription');
const { db } = require('../dbconnect');
const readfile = require('../readfile');
const { getCleanVal } = require('../utils');
const { convertVocabHasTable } = require('./convertVocabHasTable');
const { vocabImporter } = require('./convertVocabImporter');
const { createHasTable } = require('./createHasTable');
const { resolveRoot } = require('./resolveRoot');
const { resolveTags } = require('./resolveTags');
const { resolveWord } = require('./resolveWord');

/**
 * Converts a line from raw file data to object of semantically ordered data,
 * that can be imported to db
 * 
 * @param {String} dataFileLine 
 * @returns {Object}
 */
async function convertVocabLine(dataFileLine) {
    // const data = dataFileLine.split('\t');
    const [_ar, _val, cs, _root, tSynonym, tExample, transcription, tags] = dataFileLine;

    console.log(dataFileLine, tags);

    const { tagIds, catIds, stemId, sourceIds, isDisabled, isExample } = await resolveTags(tags);
    const { ar, plural, masdar, stemVowel, arVariant } = resolveWord(dataFileLine);
    const { rootId } = await resolveRoot(_root);
    const val = getCleanVal(_val);
    const arTranscription = convertToNormTranscription(transcription, _root);

    // console.log(resolveWord(data));

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
        ar,
        cs,
        plural,
        masdar,
        val,
        arVariant,
        norm: undefined,
        arTranscription,
        stemId,
        stemVowel,
        rootId,
        catIds,
        tagIds,
        synonymsIds: undefined,
        exampleIds: undefined,
        sourceIds,
        isDisabled,
        isExample,
        tExample: tExample.length === 0 ? undefined : tExample,
        tSynonym: tSynonym.length === 0 ? undefined : tSynonym,
    };

    return output;
}

/** 
 * @todo add root?
 * @todo extract to separate file?
 * @see convertVocab -> createHasTables()
 */
const createHasTables = (tables) => {
    tables.forEach((tableName) => {
        createHasTable(db, tableName);
    });
};

/**
 * Callback that handles one line of data obtained from readfile
 * @param {*} lineData 
 */
const convertVocabCb = async (lineData) => {
    try{
        const vocabObj = await convertVocabLine(lineData); // this converts raw data from file to object
        vocabImporter(db,'vocabulary',vocabObj); // this imports vocab to db
        convertVocabHasTable(db, vocabObj); // this creates relation tables for categories (tags, category, source...)
    } catch (err) {
        throw new Error(err);
    }    
};

const convertVocab = async (inputFile) => {    
    const hasTables = ['category', 'tag', 'synonym', 'example', 'source'];

    createHasTables(hasTables);
    readfile(inputFile, (data) => convertVocabCb(data));
};

module.exports = {convertVocab, convertVocabLine};