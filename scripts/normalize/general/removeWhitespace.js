const removeWhitespace = (input) => {
    const output = input.replace(/\s/g,' ');

    return output;
};

module.exports = {removeWhitespace};