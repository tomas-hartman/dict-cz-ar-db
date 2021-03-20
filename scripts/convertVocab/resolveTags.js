const { db } = require('../dbconnect/prepareRootTable');
const { extractTags } = require('../utils/extractTags');
const { transformToJson } = require('../utils/transformToJson');

/**
  * Finds id of every tag
  * @returns object with categorized information obtained from tags
  * @param {*} tagsString 
  */
async function resolveTags(tagsString) {

    // STEP 1: Sort all tags out
    const {categoriesArr,stemArr,sourceArr,tagsArr,isDisabled, isExample} = extractTags(tagsString);
 
    // STEP 2: Search db and find ids for all tags in above categories 
    const getAttrsId = async (categoriesArr, table, colName) => {
        let idPromisesArr = [];
        // open db and look to table __table for id of category
        db.serialize(() => {
            categoriesArr.forEach((category) => {
                const sql = `
                         SELECT id FROM ${table}
                         WHERE ${colName} = '${category}'
                       `;

                const resultPromise = new Promise((resolve, reject) => {
                    db.get(sql, (err, result) => {
                        if(err) reject(err);

                        const {id} = result;

                        resolve(id);
           
                    });
                });

                idPromisesArr.push(resultPromise);
            });
        });

        const output = await Promise.all(idPromisesArr);

        return output;
    };

    const outputCategory = await getAttrsId(categoriesArr, 'categories', 'category');
    const outputStem = await getAttrsId(stemArr, 'stems', 'stem');
    const outputSource = await getAttrsId(sourceArr, 'sources', 'source');
    const outputTags = await getAttrsId(tagsArr, 'tags', 'tag');

    // STEP 3: Output object with converted values
    const output = {
        tagIds: transformToJson(outputTags),
        catIds: transformToJson(outputCategory),
        sourceIds: transformToJson(outputSource),
        stemId: outputStem[0],
        isDisabled: isDisabled.length > 0 ? 1 : 0,
        isExample: isExample.length > 0 ? 1 : 0
    };
 
    return output;
}

module.exports = {resolveTags};