/**
 * Creates relation table for categories (tags, category, source...)
 * Must be called after main entry is created, because it gets its id and category id
 * @param {*} db 
 * @param {*} row 
 */
const convertVocabHasTable = (db, row, vocabularyID) => {
    /**
     * @see convertVocab -> createHasTables()
     */
    const {catIds, tagIds, synonymsIds, exampleIds, sourceIds} = row;

    const relations = {
        category: {
            ids: catIds,
            hasTable: 'category',
            mainTable: 'categories'
        },
        tag: {
            ids: tagIds,
            hasTable: 'tag',
            mainTable: 'tags'
        },
        synonym: {
            ids: synonymsIds,
            hasTable: 'synonym',
            mainTable: 'synonyms'
        },
        example: {
            ids: exampleIds,
            hasTable: 'example',
            mainTable: 'examples'
        },
        source: {
            ids: sourceIds,
            hasTable: 'source',
            mainTable: 'sources'
        }
    };

    const insertRelationData = (hasTableName, ids, mainId) => {
        if(!ids) return;

        const tableName = 'has_' + hasTableName;
        const addEntrySql = `
            INSERT INTO ${tableName} (category_id, vocabulary_id, is_disabled)
            VALUES ($categoryId, $vocabularyId, $isDisabled)
        `;
    
        const parsedIds = JSON.parse(ids);
    
        parsedIds.forEach((id) => {
            db.run(addEntrySql, {
                $vocabularyId: mainId, 
                $categoryId: id, 
                $isDisabled: 0,
            });
        });
    };

    Object.keys(relations).forEach((key) => {
        const { hasTable, ids } = relations[key];

        insertRelationData(hasTable, ids, vocabularyID);
    });
};

module.exports = {convertVocabHasTable};