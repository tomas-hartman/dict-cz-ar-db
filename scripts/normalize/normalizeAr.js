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
    
    // Remove vocalization
    output = output.replace(/[\u064b-\u0652]/g, '');
    
    // Remove [()[]{},.?]
    output = output.replace(/[\u0028-\u002f\u003a-\u0040]/g,'');

    // Remove arabic interpunction and tatweel
    output = output.replace(/[\u061e-\u061f\u061b\u060c-\u060d\u0640]/g, '');

    // Remove numerals (both latin and arabic and persian, just in case)
    output = output.replace(/[\u0030-\u0039\u0660-\u0669\u06f0-\u06f9]/g, '');

    // Remove whitespaces where there is more than 1
    output = output.replace(/\s{2,}/g,' ');
    output = output.trim();

    return output;
}

// console.log(normalizeAr("حَضَرَ (ـُ) حُضُورٌ"));

module.exports = normalizeAr;
