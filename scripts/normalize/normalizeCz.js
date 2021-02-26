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

    // Lowercase
    output = output.toLowerCase();

    // Strip diacritics
    output = output.replace(/[\u02b0-\u036f]/g, '');
    
    // Strip ()[]{} and special chars
    output = output.replace(/[\u0020-\u002f]/g, '');
    output = output.replace(/[\u005b-\u005f]/g, '');
    output = output.replace(/[\u007b-\u007f]/g, '');

    return output;
}

normalizeCz('PříliŠ ŽluŤouČký kůň pěl Ďábelské Ódy');