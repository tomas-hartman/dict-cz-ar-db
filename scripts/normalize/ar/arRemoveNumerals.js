// Remove numerals (both latin and arabic and persian, just in case)
const arRemoveNumerals = (input) => {
    const output = input.replace(/[\u0030-\u0039\u0660-\u0669\u06f0-\u06f9]/g, '');

    return output;
};

module.exports = {arRemoveNumerals};