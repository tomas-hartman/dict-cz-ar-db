const { db } = require('../../preprocess/scripts/dbconnect');
const { resolveRoot } = require('./resolveRoot');
const { getWhereClause } = require('./getWhereClause');

/**
 * searchRoot()
 *   - separators
 *   - wildcards instead w-j-'
 *   - support for D Z H 7 2
 * @param {String} input 
 * @returns {Promise<Array> | Error}
 */
const searchRoot = (input) => {
    const query = resolveRoot(input);
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

    return results;
};

/**
 * Search for results based on their root
 * @param {String} input 
 * @returns {Array | Error} Array of results or Error with incorrect query exception
 */
async function search(input, findRoot = false) {
    /**
     * Input resolves into query
     * 

     * searchFulltext()
     */
    // db.serialize(() => {

    try {
        const results = findRoot && searchRoot(input);

        console.log(await results);
        return await results;
    } catch(err) {
        console.error(err);
        return err;
    }
}

// search(inputE, true);

module.exports = { 
    search,
    searchRoot,
};