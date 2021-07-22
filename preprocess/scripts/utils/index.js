const createOutputStream = require('./createOutputStream');
const { extractTags } = require('./extractTags');
const { getCategories } = require('./getCategories');
const { getCleanVal } = require('./getCleanVal');
const { getMeaningVariant } = require('./getMeaningVariant');
const { getStem } = require('./getStem');
const { removeVariantInformation } = require('./removeVariantInformation');
const { transformToJson } = require('./transformToJson');

module.exports = {
    createOutputStream, 
    extractTags, 
    getCategories, 
    getCleanVal, 
    getMeaningVariant, 
    getStem, 
    removeVariantInformation, 
    transformToJson
};