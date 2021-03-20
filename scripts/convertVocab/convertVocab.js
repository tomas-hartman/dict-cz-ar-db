const { convertToNormTranscription } = require('../convert/convertToNormTranscription');
const { getCleanVal } = require('../utils/getCleanVal');
const { resolveRoot } = require('./resolveRoot');
const { resolveTags } = require('./resolveTags');
const { resolveWord } = require('./resolveWord');

async function convertVocab(dataFileLine) {
    const data = dataFileLine.split('\t');
    const [_ar, _val, cs, _root, tSynonym, tExample, transcription, tags] = data;

    const { tagIds, catIds, stemId, sourceIds, isDisabled, isExample } = await resolveTags(tags);
    const { ar, plural, masdar, stemVowel, arVariant } = resolveWord(data);
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
        // norm: '', // todo
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

module.exports = {convertVocab};