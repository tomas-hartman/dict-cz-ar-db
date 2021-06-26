const createHasTable = (db, categoryName) => {
    const createHasTableSql = `
        CREATE TABLE IF NOT EXISTS has_${categoryName} (
            category_id INTEGER,
            vocabulary_id INTEGER,
            is_disabled INTEGER 
            )`;
    
    db.serialize(() => {
        db.run(createHasTableSql);
    });
};

module.exports = { createHasTable };