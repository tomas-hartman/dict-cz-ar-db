const { arRemoveAllParentheses } = require('./ar/arRemoveAllParentheses');
const { arRemoveNativeInterpunction } = require('./ar/arRemoveNativeInterpunction');
const { arRemoveNumerals } = require('./ar/arRemoveNumerals');
const { arRemoveVocalization } = require('./ar/arRemoveVocalization');
const { removeMultipleWhitespace } = require('./general/removeMultipleWhitespace');

String.prototype.toUnicode = function(){
    let result = '';
    for(var i = 0; i < this.length; i++){
        // Assumption: all characters are < 0xffff
        result += '\\u' + ('000' + this[i].charCodeAt(0).toString(16)).substr(-4);
    }
    return result;
};

/**
 * Strips vocalization and maybe more
 * What I want to strip? Podtržítka, vokalizaci, interpunkci, závorky, čísla
 * Otazník: co spodní a horní alify? Co šadda?
 * Řešení: přidat option
 */
function normalizeAr(word) {
    let output = word.normalize('NFD');
    
    output = arRemoveVocalization(output);
    output = arRemoveAllParentheses(output); // Remove [()[]{},.?]
    output = arRemoveNativeInterpunction(output);
    output = arRemoveNumerals(output);
    output = removeMultipleWhitespace(output);

    output = output.trim();

    return output;
}

// console.log(normalizeAr("حَضَرَ (ـُ) حُضُورٌ"));

module.exports = {normalizeAr};
