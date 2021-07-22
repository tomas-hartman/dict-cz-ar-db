// Remove [()[]{},.?]
const arRemoveAllParentheses = (input) => {
    const output = input.replace(/[\u0028-\u002f\u003a-\u0040\u005b-\u005f\u007b-\u007e]/g,'');

    return output;
};

module.exports = {arRemoveAllParentheses};