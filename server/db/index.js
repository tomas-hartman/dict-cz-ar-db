
const express = require('express');
const app = express();
const port = 3011;

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
const query = `
  SELECT
    v.id, v.ar, v.cs, v.plural, v.masdar, v.valency, v.ar_variant, v.norm, v.ar_transcription, v.stem_vowel,
    c.tags,
    t.categories,
    r.root_lat, r.root_ar,
    st.stem
  FROM
    vocabulary AS v

  LEFT JOIN
  (
    SELECT has_tag.*, group_concat(tags.tag) as tags
    FROM has_tag
    JOIN tags 
    ON tags.id = has_tag.category_id
    WHERE has_tag.is_disabled = 0 AND tags.is_disabled = 0
    GROUP BY vocabulary_id
  ) as c
  ON c.vocabulary_id = v.id

  LEFT JOIN
  (
    SELECT has_category.*, group_concat(categories.category) as categories
    FROM has_category
    JOIN categories 
    ON categories.id = has_category.category_id
    WHERE has_category.is_disabled = 0 AND categories.is_disabled = 0
    GROUP BY vocabulary_id
  ) as t
  ON t.vocabulary_id = v.id

  LEFT JOIN 
  roots as r 
  ON r.id = v.root_id

  LEFT JOIN 
  stems as st
  ON st.id = v.stem_id

  -- WHERE v.id=256 OR v.id=1024
  GROUP BY v.id
`;

app.get('/dict', (req, res) => {
    db.all(query, (err, rows) => {
        if(err) throw new Error(err);

        res.send(JSON.stringify(rows));
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
