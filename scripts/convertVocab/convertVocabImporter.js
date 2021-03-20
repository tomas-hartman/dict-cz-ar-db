const readfile = require('../readfile');
const path = require('path');

const {db} = require('../dbconnect/prepareRootTable');

const vocabImporter = (db, tableName, row) => {
    const createTableSql = `
    CREATE TABLE IF NOT EXISTS vocabulary (
        id INTEGER PRIMARY KEY,
        ar TEXT,
        cs TEXT,
        plural TEXT,
        masdar TEXT,
        valency TEXT,
        ar_variant TEXT,
        norm TEXT,
        ar_transcription TEXT,
        stem TEXT,
        stem_vowel TEXT,
        root_id INTEGER,
        cat_ids TEXT,
        synonyms_ids TEXT,
        tag_ids TEXT,
        example_ids TEXT,
        source_ids TEXT,
        is_disabled INTEGER,
        is_example INTERER,
        t_example TEXT,
        t_synonym TEXT,
        )`;
        

    /** @todo this */
    const isEntryExistingSql = `
        SELECT EXISTS (SELECT 1 from ${tableName} WHERE ar = $ar AND cs = $cs)
        `;
        
    const addEntrySql = `
        INSERT INTO ${tableName} (
            ar,
            cs,
            plural,
            masdar,
            valency,
            ar_variant,
            norm,
            ar_transcription,
            stem,
            stem_vowel,
            root_id,
            cat_ids,
            synonyms_ids,
            tag_ids,
            example_ids,
            source_ids,
            is_disabled,
            is_example,
            t_example,
            t_synonym,
        )
        VALUES (
            $ar,
            $cs,
            $plural,
            $masdar,
            $valency,
            $ar_variant,
            $norm,
            $ar_transcription,
            $stem,
            $stem_vowel,
            $root_id,
            $cat_ids,
            $synonyms_ids,
            $tag_ids,
            $example_ids,
            $source_ids,
            $is_disabled,
            $is_example,
            $t_example,
            $t_synonym,
        )
        `;
        
    db.serialize(() => {
        //  * 1. does the table exist --> create if not --> done
        db.run(createTableSql);
        
        //  * 2. does the row exist --> log if yes --> 
        db.each(isEntryExistingSql, {$ar: row.ar, $cs: row.cs}, (err, resultRow) => {
            // if(!resultRow) return;

            const [isExisting] = Object.values(resultRow);
            
            if(isExisting > 0) {
                console.log('Entry already existing:', row);
            } else {
                //  * 3. create new entry
                db.run(addEntrySql, {
                    $ar: row.ar,
                    $cs: row.cs,
                    $plural: row.plural,
                    $masdar: row.masdar,
                    $valency: row.valency,
                    $ar_variant: row.arVariant,
                    $norm: row.norm,
                    $ar_transcription: row.arTranscription,
                    $stem: row.stem,
                    $stem_vowel: row.stemVowel,
                    $root_id: row.rootId,
                    $cat_ids: row.catIds,
                    $synonyms_ids: row.synonymsIds,
                    $tag_ids: row.tagIds,
                    $example_ids: row.exampleIds,
                    $source_ids: row.sourceIds,
                    $is_disabled: row.isDisabled,
                    $is_example: row.isExample,
                    $t_example: row.tExample,
                    $t_synonym: row.tSynonym,
                });
            }
        });
    });
};

module.exports = { vocabImporter };