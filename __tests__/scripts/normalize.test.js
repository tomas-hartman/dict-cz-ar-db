const { normalizeAr, normalizeCz } = require('../../scripts/normalize/normalize');

describe('NormalizeCz', () => {
    describe('default', () => {
        it('should return expected result (cz)', () => {
            const input = 'PříliŠ ŽluŤouČký kůň pěl Ďábelské Ódy!!!';
            const expected = 'priliszlutouckykunpeldabelskeody';

            const output = normalizeCz(input);

            expect(output).toBe(expected);
        });
    });
});

describe('NormalizeAr', () => {
    describe('default', () => {
        it('should return expected result (ar)', () => {
            const input = 'حَضَرَ (ـُ) حُضُورٌ';
            const expected = 'حضر حضور';

            const output = normalizeAr(input);

            expect(output).toBe(expected);
        });
    });
});