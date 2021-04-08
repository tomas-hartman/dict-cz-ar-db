const readfile = require('../readfile');
const path = require('path');

const { convertToNormTranscription } = require('../convert/convertToNormTranscription');
const {conversionTableToAr} = require('../convert/conversionTableToAr');

const { db } = require('../dbconnect');

/**
 * Imports roots directly to DB (skipping csv)
 * @param {Object} db database object
 * @param {String} tableName 
 * @param {Object} row data that are transformed into one db row
 */
const importToDb = (db, tableName, row) => {
    const createTableSql = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY, 
        root_origin TEXT UNIQUE,
        root_ar TEXT,
        root_lat TEXT,
        is_disabled INTEGER 
        )`;
        
    const isEntryExistingSql = `
        SELECT EXISTS (SELECT 1 from ${tableName} WHERE root_origin = $root)
        `;
        
    const addRootToDbSql = `
        INSERT INTO ${tableName} (root_origin, root_ar, root_lat, is_disabled)
        VALUES ($origin, $arabic, $transcription, $is_disabled)
        `;
        
    db.serialize(() => {
        //  * 1. does the table exist --> create if not --> done
        db.run(createTableSql);
        
        //  * 2. does the row exist --> log if yes --> 
        db.each(isEntryExistingSql, {$root: row.origin}, (err, resultRow) => {
            const [isExisting] = Object.values(resultRow);
            
            if(isExisting > 0) {
                console.log('Root already exists:', row);
            } else {
                //  * 3. create new entry
                db.run(addRootToDbSql, {
                    $origin: row.origin, 
                    $arabic: row.arabic, 
                    $transcription: row.transcription, 
                    $is_disabled: 0,
                });
            }
        });
    });
};

/**
 * @todo přepsat a líp logicky uspořádat
 * @todo přidat upozornění na chyby
 * @param {*} data 
 */
async function transformRootFileLine(data) {
    const [root] = data;

    const getTranscription = (root) => {
        let transcription = root.split('-');

        transcription = transcription.map((consonant) => {
            const output = convertToNormTranscription(consonant);

            return output;
        });

        return transcription.join('');
    };

    const getAr = (normTransctiption) => {
        let output = normTransctiption.split('');

        output = output.map((char) => {
            return conversionTableToAr[char];
        });

        return output.join('');
    };

    const getOutput = () => {
        /**
         * @todo tohle má vyhodit analyze error
         * @todo kořen může být i dh, h nebo ka
         */
        if(!root.match(/[-]/g) || root.split(' ').length > 1){
            console.log(root);
    
            return {
                origin: root,
                transcription: undefined,
                arabic: undefined
            };
        }
    
        const transcribedRoot = getTranscription(root);

        return {
            origin: root,
            transcription: transcribedRoot,
            arabic: getAr(transcribedRoot)
        };
    };

    const output = getOutput();

    return output;
}

function convertRootsToDb(inputFile) {
    const dirName = path.parse(inputFile).name;
    const dataFile = path.resolve(__dirname, '../../output', dirName, 'roots.txt');

    readfile(dataFile, async (data) => {
        const outputRowObj = transformRootFileLine(data);
        
        importToDb(db, 'roots', await outputRowObj);
    });
}

module.exports = { convertRootsToDb };