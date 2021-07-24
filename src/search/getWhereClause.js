const { isRootInArabic } = require('./resolveRoot');

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

    return 'WHERE ' + rootVariants;
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

    return `WHERE ${column} = '${query}'`;
};

module.exports = { getWhereClause, getWeakVowelClause, getAsteriskClause };