const { czRemoveDiacritics } = require('./cz/czRemoveDiacritics');
const { czRemoveSpecialChars } = require('./cz/czRemoveSpecialChars');

String.prototype.toUnicode = function(){
    let result = '';
    for(var i = 0; i < this.length; i++){
        // Assumption: all characters are < 0xffff
        result += '\\u' + ('000' + this[i].charCodeAt(0).toString(16)).substr(-4);
    }
    return result;
};

function normalizeCz(text) {
    let output = text.normalize('NFD');

    output = output.toLowerCase(); // Convert to lowercase

    output = czRemoveDiacritics(output);
    output = czRemoveSpecialChars(output);

    return output;
}

module.exports = {normalizeCz};