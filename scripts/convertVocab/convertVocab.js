/**
 * 1. otevře raw file
 * 2. 
 */

const { resolveTags } = require('./resolveTags');

async function convertVocab(dataFileLine) {
    const [ar, val, cs, root, tSynonym, tExample, transcription, tags] = dataFileLine.split('\t');

    console.log('tags:', tags);

    const {tagIds, catIds, stem, sourceIds, isDisabled, isExample} = await resolveTags(tags);

    // console.log(await resolveTags(tags));

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
        // ar: wordForm,
        cs,
        // plural: otherFormsObj.plural,
        // masdar: otherFormsObj.masdar,
        // val: getCleanVal(val),
        // arVariant: getMeaningVariant(ar),
        // norm: '', // todo
        // arTranscription: normTranscription,
        stem,
        // stemVowel: otherFormsObj.vowel,
        // rootId: getId(root, roots),
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

module.exports = {convertVocab};