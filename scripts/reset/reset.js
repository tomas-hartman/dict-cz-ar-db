const { db, backupDb } = require('../dbconnect');

const resetAll = () => {
    backupDb();
    
    const sql = `
        DROP TABLE roots;
        DROP TABLE vocabulary;
        DROP TABLE categories;
        DROP TABLE tags;
        DROP TABLE sources;
        DROP TABLE has_category;
        DROP TABLE has_tag;
        DROP TABLE has_source;
        DROP TABLE has_synonym;
        DROP TABLE has_example;
    `;

    db.exec(sql, (err) => {
        if(err) throw new Error(err);

        console.log('Database records successfully deleted');
    });
};

module.exports = {resetAll};