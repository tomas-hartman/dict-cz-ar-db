// Remove vocalization
const arRemoveVocalization = (input) => {
    const output = input.replace(/[\u064b-\u0652]/g, '');

    return output;
};

module.exports = {arRemoveVocalization};