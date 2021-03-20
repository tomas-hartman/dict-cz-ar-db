/**
 * 1. convert and merge roots
 * 2. tags, categories, sources
 * 3. stems (manually)
 * 4. synonyms, examples (!todo)
 */
const { checkAttrFilesExist } = require('../control/checkFilesExist');
const { convertAttrToDb } = require('./convertAttr');

const { convertRootsToDb } = require('./convertRoots');

const { categoriesImporter } = require('./convertCategories');
const { sourcesImporter } = require('./convertSources');
const { tagsImporter } = require('./convertTags');

/**
  * Extract information from tags and generates separate list of roots.
  */
const convertAttrs = (filename) => {
    if(checkAttrFilesExist(filename)){    
        // Convert roots to db     
        convertRootsToDb(filename);
        
        // Convert tags, sources and categories to db
        convertAttrToDb(filename, 'source', 'sources', sourcesImporter);
        convertAttrToDb(filename, 'tag', 'tags', tagsImporter);
        convertAttrToDb(filename, 'category', 'categories', categoriesImporter);

    } else {
        throw new Error('Make sure all attribute files exist and that are properly analyzed before proceeding to this step!');
    }
};
 
module.exports = convertAttrs;
 