function getMeaningVariant(word) {
    let match = word.match(/\(\d\)|{\d}/g);

    if (match) {
        match.filter((item) => item !== '');
        match = match[0];
        match = match.replace(/\D/g, '');

        return match;
    }

    return undefined;
}

module.exports = {getMeaningVariant};
