const readfile = require('../readfile');
const path = require('path');

const {db} = require('../dbconnect/prepareRootTable');

const importToDb = (db, tableName, row) => {
    const createTableSql = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY, 
        tag TEXT UNIQUE,
        description TEXT,
        is_disabled INTEGER 
        )`;
        
    const isEntryExistingSql = `
        SELECT EXISTS (SELECT 1 from ${tableName} WHERE tag = $tag)
        `;
        
    const addEntrySql = `
        INSERT INTO ${tableName} (tag, description, is_disabled)
        VALUES ($tag, $description, $is_disabled)
        `;
        
    db.serialize(() => {
        //  * 1. does the table exist --> create if not --> done
        db.run(createTableSql);
        
        //  * 2. does the row exist --> log if yes --> 
        db.each(isEntryExistingSql, {$tag: row.tag}, (err, resultRow) => {
            const [isExisting] = Object.values(resultRow);
            
            if(isExisting > 0) {
                console.log('Entry already existing:', row);
            } else {
                //  * 3. create new entry
                db.run(addEntrySql, {
                    $tag: row.tag, 
                    $description: row.description, 
                    $is_disabled: row.isDisabled,
                });
            }
        });
    });
};

function transformRootFileLine(data) {
    const [tag] = data;

    return {
        tag,
        description: undefined,
        isDisabled: 0,
    };
}

function convertTagsToDb(inputFile) {
    
    const dirName = path.parse(inputFile).name;
    const dataFile = path.resolve(__dirname, '../../output', dirName, 'tags.txt');

    readfile(dataFile, async (data) => {
        const outputRowObj = transformRootFileLine(data);
        
        // console.log(await outputRowObj);
        importToDb(db, 'tags', outputRowObj);
    });
}

module.exports = { convertTagsToDb };