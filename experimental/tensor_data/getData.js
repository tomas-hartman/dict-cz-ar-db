const path = require('path');
const fs = require('fs');

const {db} = require('../../preprocess/scripts/dbconnect/index');
const { normalizeAr } = require('../../preprocess/scripts/normalize');

const outputFileName = path.resolve(__dirname, './categories_input_data.json');
const charsTableFile = path.resolve(__dirname, './chars_convert_table.json');
const writeStream2 = (filename) => fs.createWriteStream(filename);
const sql = 'SELECT ar, cat_ids FROM vocabulary WHERE cat_ids NOT null';

db.all(sql, (err, rows) => {    
    if(err) throw new Error(err);

    // const output = getData(rows);
    const output = processChars(rows);

    writeStream2(charsTableFile).write(JSON.stringify(Array.from(output)), (err) => {
        if(err) throw new Error(err);
    }
    );

    // writeStream2(outputFileName).write(JSON.stringify(output), (err) => {
    //     if(err) throw new Error(err);
    // });
});

const processChars = (rows) => {
    const letters = new Set();

    for(let j in rows) {
        const row = rows[j];

        const {ar} = row;

        const letterMap = [...normalizeAr(ar)];

        letterMap.forEach((char) => {
            letters.add(char.normalize('NFKD'));
        });
    }
    console.log(letters);

    return letters;
};

const getData = (rows) => {
    let outputData = [];

    for(let j in rows) {
        const row = rows[j];

        const {ar, cat_ids} = row;
        const cats = JSON.parse(cat_ids);
    
        // rule out phrases
        if(ar.split(' ').length > 1) continue;
    
        // each category has its own entry
        for(let i in cats) {
            const cleanAr = normalizeAr(ar);
    
            outputData.push([cleanAr, cats[i]]);
        }
    }

    return outputData;
};

// (async () => {
//     await promise;
    
//     
// })();

