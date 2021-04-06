// Ar
const {normalizeAr} = require('./normalizeAr');
const { arRemoveAllParentheses } = require('./ar/arRemoveAllParentheses');
const { arRemoveNativeInterpunction } = require('./ar/arRemoveNativeInterpunction');
const { arRemoveNumerals } = require('./ar/arRemoveNumerals');
const { arRemoveVocalization } = require('./ar/arRemoveVocalization');

// Cz
const {normalizeCz} = require('./normalizeCz');
const { czRemoveDiacritics } = require('./cz/czRemoveDiacritics');
const { czRemoveSpecialChars } = require('./cz/czRemoveSpecialChars');

// General
const { removeMultipleWhitespace } = require('./general/removeMultipleWhitespace');
const { removeWhitespace } = require('./general/removeWhitespace');

module.exports = {
    normalizeCz,
    normalizeAr,
    arRemoveAllParentheses,
    arRemoveNativeInterpunction,
    arRemoveNumerals,
    arRemoveVocalization,
    czRemoveDiacritics,
    czRemoveSpecialChars,
    removeMultipleWhitespace,
    removeWhitespace
};