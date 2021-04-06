const { normalizeCz } = require('../../scripts/normalize/normalizeCz');

describe('NormalizeCz', () => {
    describe('default', () => {
        it('should return expected result', () => {
            const input = 'PříliŠ ŽluŤouČký kůň pěl Ďábelské Ódy';
            const expected = 'priliszlutouckykunpeldabelskeody';

            const output = normalizeCz(input);

            expect(output).toBe(expected);
        });
    });
});