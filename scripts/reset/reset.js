const { db, backupDb } = require('../dbconnect');

const resetAll = () => {
    const sql = `
        DROP TABLE roots;
        DROP TABLE vocabulary;
        DROP TABLE categories;
        DROP TABLE tags;
        DROP TABLE sources;
    `;

    backupDb();

    db.exec(sql, (err) => {
        if(err) throw new err;

        console.log('Database records successfully deleted');
    });
};

module.exports = {resetAll};