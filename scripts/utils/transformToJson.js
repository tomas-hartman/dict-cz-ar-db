function transformToJson(array) {
    if (array.length > 0) return JSON.stringify(array);

    return undefined;
}

module.exports = {transformToJson};