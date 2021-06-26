/**
 * Converts all important attributed data for vocabulary, except the vocabulary itself.
 * Prepares all indexes to be ready, so vocabulary conversion can be achieved.
 * 
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
const convertAttrs = async (filename) => {
    if(checkAttrFilesExist(filename)){    
        // Convert roots to db     
        const roots = convertRootsToDb(filename);
        
        // Convert tags, sources and categories to db
        const source = convertAttrToDb(filename, 'source', 'sources', sourcesImporter);
        const tag = convertAttrToDb(filename, 'tag', 'tags', tagsImporter);
        const category = convertAttrToDb(filename, 'category', 'categories', categoriesImporter);

        return Promise.allSettled([roots, source, tag, category]);
    } else {
        throw new Error('Make sure all attribute files exist and that are properly analyzed before proceeding to this step!');
    }
};
 
module.exports = {convertAttrs};
 