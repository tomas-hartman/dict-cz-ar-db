const {clean} = require('../../src/search/resolveRoot');

describe('Function clean()', () => {
    describe('Arabic', () => {
        const dataset = ['د ر س', 'د-ر-س', 'ول؟', 'ولي', 'أول', 'و-ل-؟'];
        const results = ['درس', 'درس', 'ول؟', 'ولي', 'ءول', 'ول؟'];

        const testset = dataset.map((item, i) => {
            return [item, results[i]];
        });

        it.each(testset)(
            'clean("%s") should return "%s"',
            (input, expected) => {
                expect(clean(input)).toBe(expected);
            }
        );
    });

    describe('Latin', () => {
        const testset = [
            ['k-t-b', 'ktb'],
            ['k t b', 'ktb'],
            ['k.t.b', 'ktb'],
            ['ktb', 'ktb'],
            ['w dž h', 'wǧh'],
            ['S-H-H', 'ṣḥḥ'],
            ['S-7-7', 'ṣḥḥ'],
            ['w-l-?', 'wl?'],
            ['kitáb', 'kitāb'],
            ['\' w l', 'ʾwl']
        ];

        it.each(testset)(
            'clean("%s") should return "%s"',
            (input, expected) => {
                expect(clean(input)).toBe(expected);
            }
        );
    });
});