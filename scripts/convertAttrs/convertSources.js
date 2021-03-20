const sourcesImporter = (db, tableName, row) => {
    const createTableSql = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY, 
        source TEXT UNIQUE,
        description TEXT,
        is_disabled INTEGER 
        )`;
        
    const isEntryExistingSql = `
        SELECT EXISTS (SELECT 1 from ${tableName} WHERE source = $source)
        `;
        
    const addEntrySql = `
        INSERT INTO ${tableName} (source, description, is_disabled)
        VALUES ($source, $description, $is_disabled)
        `;
        
    db.serialize(() => {
        //  * 1. does the table exist --> create if not --> done
        db.run(createTableSql);
        
        //  * 2. does the row exist --> log if yes --> 
        db.each(isEntryExistingSql, {$source: row.source}, (err, resultRow) => {
            const [isExisting] = Object.values(resultRow);
            
            if(isExisting > 0) {
                console.log('Entry already existing:', row);
            } else {
                //  * 3. create new entry
                db.run(addEntrySql, {
                    $source: row.source, 
                    $description: row.description, 
                    $is_disabled: row.isDisabled,
                });
            }
        });
    });
};

module.exports = { sourcesImporter };