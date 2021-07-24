
const express = require('express');
const app = express();
const port = 3011;

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// eslint-disable-next-line node/no-unpublished-require
const {getSql} = require('../../src/search/getSql');
// eslint-disable-next-line node/no-unpublished-require
const {searchRoot} = require('../../src/search/search');

const pathToDb = path.resolve(__dirname, '../../db/dictionary_1.0.0.db');

const errorCb = (err) => {
    if(err) {
        throw new Error(err);
    }

    console.log('Connected to the database.');
};

let db = new sqlite3.Database(pathToDb, errorCb);
const query = getSql();

app.get('/dict', (req, res) => {
    db.all(query, (err, rows) => {
        if(err) throw new Error(err);

        res.send(JSON.stringify(rows));
    });
});

app.get('/q/:query', async (req, res) => {
    const result = await searchRoot(req.params.query);

    res.send(JSON.stringify(result));
});

app.get('/cat/:query', async (req, res) => {
    const {query} = req.params;
    let whereClause = '';

    switch (query) {
    case 'all':
        whereClause = '';
        break;
    case 'uncategorized':
        whereClause = 'WHERE t.category_id IS null';
        break;
    default:
        whereClause = `WHERE t.category_id = ${query}`;    
        break;
    }

    const sql = getSql({whereClause});
  
    db.all(sql, (err, rows) => {
        if(err) throw new Error(err);

        res.send(JSON.stringify(rows));
    });
});

app.get('/tag/:query', async (req, res) => {
    /** @todo */
    // const result = await searchRoot(req.params.query);

    // res.send(JSON.stringify(result));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
