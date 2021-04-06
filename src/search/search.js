const { db } = require('../../scripts/dbconnect/prepareRootTable');
const { resolveRoot, isRootInArabic } = require('./resolveRoot');

/**
 * Returns query with GLOB matcher for * wildcard
 * @param {String} column name of column in which to search
 * @param {String} query query with * wildcard
 * @returns 
 */
const getAsteriskClause = (column, query) => {
    if(query.length === 1) {
        throw new Error('Wildcard must always be used along with other characters, never on its own.');
    }

    return `${column} GLOB '${query}'`;
};

/**
 * Creates multiple sql queries joined with OR
 * @param {String} column name of column in which to search
 * @param {String} query query with ? wildcard
 * @returns {String} final query
 */
const getWeakVowelClause = (column, query) => {
    const matches = query.match(/[?؟]/g);

    const alternativesCz = ['j', 'w', 'ʾ'];
    const alternativesAr = ['ي', 'و', 'ء'];

    const alternatives = isRootInArabic(query) ? alternativesAr : alternativesCz;

    if(query.length === matches.length) {
        throw new Error('Wildcard must always be used along with other characters, never on its own.');
    }

    let rootVariants = alternatives.map((char) => {
        const possibleRoot = query.replace(/[?؟]/, char);
        return `${column} = '${possibleRoot}'`;
    });
    
    rootVariants = rootVariants.join(' OR ');

    return rootVariants;
};

/**
 * if query has ? (wl?) then create query where column = wlj or column = wlw or column = wl'
 * if query has * (wl?) then create query where column glob like wl? 
 * Warn! Different for ar and for lat
 * @param {String} _query either in arabic or in latin script
 * @returns {String}
 */
const getWhereClause = (_query) => {
    const [_table, column, query] = _query;

    const containsWeakVowelWildcard = query.match(/[?؟]/g);
    const containsAsteriskWildcard = query.match(/[*]/g);

    if(containsAsteriskWildcard?.length > 1 || containsWeakVowelWildcard?.length > 1) {
        throw new Error('You can only use one wildcard for one search query!');
    }
    
    if(containsWeakVowelWildcard && containsAsteriskWildcard) {
        throw new Error('You may not combine wildcards in one query, use either \'*\' or \'?\'!');
    }

    if(containsWeakVowelWildcard) return getWeakVowelClause(column, query);
    if(containsAsteriskWildcard) return getAsteriskClause(column, query);

    return `${column} = '${query}'`;
};

/**
 * Search for results based on their root
 * @param {String} input 
 * @returns {Array | Error} Array of results or Error with incorrect query exception
 */
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

    try {
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
    
        console.log(await results);
    
        return await results;
    } catch(err) {
        console.error(err);
        return err;
    }
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
const input5 = 'd3?'; 
const input6 = '?l?'; 
const input7 = 'dl*'; 
const input8 = '?'; 
const input9 = '*'; 
const input10 = '2mn'; 
const input11 = 'ول؟'; 

search(input11);