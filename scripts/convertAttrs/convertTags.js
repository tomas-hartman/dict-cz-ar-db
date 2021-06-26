const tagsImporter = async (db, tableName, row) => {
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
    
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            //  * 1. does the table exist --> create if not --> done
            db.run(createTableSql);
            
            //  * 2. does the row exist --> log if yes --> 
            db.each(isEntryExistingSql, {$tag: row.tag}, (err, resultRow) => {
                const [isExisting] = Object.values(resultRow);
                
                if(isExisting > 0) {
                    console.log('Entry already exists:', row);
                } else {
                    //  * 3. create new entry
                    db.run(addEntrySql, {
                        $tag: row.tag, 
                        $description: row.description, 
                        $is_disabled: row.isDisabled,
                    });
                }
            }, (err, count) => {
                if(err) reject(err);

                resolve(count);
            });
        });
    });
};

module.exports = { tagsImporter };