const readfile = require('../readfile');
const path = require('path');

const {db} = require('../dbconnect/prepareRootTable');

const importToDb = (db, tableName, row) => {
    const createTableSql = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY, 
        category TEXT UNIQUE,
        description TEXT,
        is_disabled INTEGER 
        )`;
        
    const isEntryExistingSql = `
        SELECT EXISTS (SELECT 1 from ${tableName} WHERE category = $category)
        `;
        
    const addEntrySql = `
        INSERT INTO ${tableName} (category, description, is_disabled)
        VALUES ($category, $description, $is_disabled)
        `;
        
    db.serialize(() => {
        //  * 1. does the table exist --> create if not --> done
        db.run(createTableSql);
        
        //  * 2. does the row exist --> log if yes --> 
        db.each(isEntryExistingSql, {$category: row.category}, (err, resultRow) => {
            // if(!resultRow) return;

            const [isExisting] = Object.values(resultRow);
            
            if(isExisting > 0) {
                console.log('Entry already existing:', row);
            } else {
                //  * 3. create new entry
                db.run(addEntrySql, {
                    $category: row.category, 
                    $description: row.description, 
                    $is_disabled: row.isDisabled,
                });
            }
        });
    });
};

function transformFileLine(data) {
    const [category] = data;

    return {
        category,
        description: undefined,
        isDisabled: 0,
    };
}

function convertCategoriesToDb(inputFile) {
    
    const dirName = path.parse(inputFile).name;
    const dataFile = path.resolve(__dirname, '../../output', dirName, 'categories.txt');

    readfile(dataFile, async (data) => {
        const outputRowObj = transformFileLine(data);
        
        // console.log(await outputRowObj);
        importToDb(db, 'categories', outputRowObj);
    });
}

module.exports = { convertCategoriesToDb };