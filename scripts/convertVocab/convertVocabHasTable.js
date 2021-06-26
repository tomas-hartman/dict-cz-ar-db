/**
 * Creates relation table for categories (tags, category, source...)
 * Must be called after main entry is created, because it gets its id and category id
 * @param {*} db 
 * @param {*} row 
 */
const convertVocabHasTable = (db, row) => {
    /**
     * @see convertVocab -> createHasTables()
     */
    const hasTables = ['category', 'tag', 'synonym', 'example', 'source'];
    const {catIds, tagIds, synonymsIds, exampleIds, sourceIds} = row;

    const relations = {
        category: catIds,
        tag: tagIds,
        synonym: synonymsIds,
        example: exampleIds,
        source: sourceIds
    };

};

module.exports = {convertVocabHasTable};