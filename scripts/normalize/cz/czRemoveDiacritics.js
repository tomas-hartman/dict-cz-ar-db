// Strip diacritics
const czRemoveDiacritics = (input) => {
    const output = input.replace(/[\u02b0-\u036f]/g, '');

    return output;
};

module.exports = {czRemoveDiacritics};