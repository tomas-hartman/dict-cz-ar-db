const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const pathToDb = path.resolve(__dirname, '../../db/dictionary_1.0.0.db');

const errorCb = (err) => {
    if(err) {
        throw new Error(err);
    }

    console.log('Connected to the database.');
};

let db = new sqlite3.Database(pathToDb, errorCb);

module.exports = {db};