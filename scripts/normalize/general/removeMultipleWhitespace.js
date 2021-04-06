// Remove whitespaces where there is more than 1
const removeMultipleWhitespace = (input) => {
    const output = input.replace(/\s{2,}/g,' ');

    return output;
};

module.exports = {removeMultipleWhitespace};