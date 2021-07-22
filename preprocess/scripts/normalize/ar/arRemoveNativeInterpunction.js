// Remove arabic interpunction and tatweel
const arRemoveNativeInterpunction = (input) => {
    const output = input.replace(/[\u061e-\u061f\u061b\u060c-\u060d\u0640]/g, '');

    return output;
};

module.exports = {arRemoveNativeInterpunction};