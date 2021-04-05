const { db } = require('../../scripts/dbconnect/prepareRootTable');

const getWhereClause = (query) => {
    // params must be: table, query 
    // if query has ? (wl?) then create query where column = wlj or column = wlw or column = wl'
    // if query has * (wl?) then create query where column glob like wl? 
    // -- different for ar and for lat

    return `root_origin = '${query}'`;
};

async function search(input) {
    /**
     * Input resolves into query
     * 
     * searchRoot()
     *   - separators
     *   - wildcards instead w-j-'
     *   - support for D Z H 7 2
     * searchFulltext()
     */
    // db.serialize(() => {

    const query = input;

    // this will need to be generated specifically in 
    const whereClause = getWhereClause(query);
        
    const results = new Promise((resolve, reject) => {
        db.all(`
            SELECT * 
            FROM (
                SELECT vocabulary.*, roots.root_origin, roots.root_ar, roots.root_lat 
                FROM vocabulary 
                JOIN roots
                ON vocabulary.root_id = roots.id
            )
            WHERE ${whereClause}
                AND is_disabled = 0
        `, (err, result) => {
            if(err) {
                reject(err);
            }
            
            resolve(result);            
        });
    });

    // const 
    // });

    console.log(await results);

    return await results;
}

/**
 * Phases:
 * 
 * 1. simple root query
 * 2. more complicated root query (w-j-'-?)
 */

const input1 = 'ktb';
const input2 = 'كتب';
const input3 = 's-f-r';
const input4 = 'k t b';
// const input5 = 

search(input3);