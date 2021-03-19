/**
 * 1. convert and merge roots
 * 2. tags, categories, sources
 * 3. stems (manually)
 * 4. synonyms, examples (!todo)
 */

const { checkAttrFilesExist } = require('../control/checkFilesExist');
const { convertCategoriesToDb } = require('./convertCategories');
const { convertRootsToDb } = require('./convertRoots');
const { convertSourcesToDb } = require('./convertSources');
const { convertTagsToDb } = require('./convertTags');
 
/**
  * Extract information from tags and generates separate list of roots.
  */
const convertAttrs = (filename) => {
    if(checkAttrFilesExist(filename)){    
        // Convert roots to db     
        convertRootsToDb(filename);
        
        // Convert tags, sources to db
        convertTagsToDb(filename);
        convertSourcesToDb(filename);
        convertCategoriesToDb(filename);
    } else {
        throw new Error('Make sure all attribute files exist and that are properly analyzed before proceeding to this step!');
    }
};
 
module.exports = convertAttrs;
 
 