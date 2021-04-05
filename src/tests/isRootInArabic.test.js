const {isRootInArabic} = require('../search/resolveRoot');

describe('isRootInArabic', () => {
    describe('Basic', () => {
        it('should return false for latin', () => {
            const output = isRootInArabic('k-t-b');
    
            expect(output).toBe(false);
        });
        
        it('should return true for arabic', () => {
            const output = isRootInArabic('درس');
            
            expect(output).toBe(true);
        });
    });
    
    describe('Mixed', () => {
        it('should return false for mixed', () => {
            const output = isRootInArabic('k-t-b كتب');
        
            expect(output).toBe(false);
        });
    });

    describe('Arabic variants (true cases)', () => {
        // @todo this set is reusable for ar root clean(), some cases can be added
        const dataset = ['د ر س', 'د-ر-س', 'ول؟', 'ولي', 'أول', 'و-ل-؟'];

        it.each(dataset)(
            'isRootInArabic(%s)',
            (input) => {
                const output = isRootInArabic(input);

                expect(output).toBe(true);
            }
        );
    });
});
