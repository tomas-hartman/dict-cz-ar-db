const categoriesImporter = async (db, tableName, row) => {
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

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            //  * 1. does the table exist --> create if not --> done
            db.run(createTableSql);
                
            //  * 2. does the row exist --> log if yes --> 
            db.each(isEntryExistingSql, {$category: row.category}, (err, resultRow) => {
                // if(!resultRow) return;
                    
                const [isExisting] = Object.values(resultRow);
                    
                if(isExisting > 0) {
                    console.log('Entry already exists:', row);
                } else {
                    //  * 3. create new entry
                    db.run(addEntrySql, {
                        $category: row.category, 
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

module.exports = { categoriesImporter };