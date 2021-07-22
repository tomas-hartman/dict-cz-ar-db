// 
/**
 * Strip most common special chars, parentheses etc.
 * Warning! It also strips wildcard chars (? *)
 * @param {String} input 
 * @returns {String}
 */
const czRemoveSpecialChars = (input) => {
    let output = input;

    output = output.replace(/[\u0020-\u002f]/g, ''); // ! " # % & ' ( ) * + , - . /
    output = output.replace(/[\u003a-\u003f]/g, ''); // : ; < = > ?
    output = output.replace(/[\u005b-\u005f]/g, ''); // [ \ ] ^ _
    output = output.replace(/[\u007b-\u007f]/g, ''); // { | } ~

    return output;
};

module.exports = {czRemoveSpecialChars};