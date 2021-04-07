const {resolveRoot, clean} = require('../../src/search/resolveRoot');

const inputs = [
    'ktb',
    'كتب',
    'ك-ت-ب',
    's-f-r',
    'k.t.b',
    'k t b',
    '2mn',
    'dž r j',
    'džrj',
    'd3?',
    'd3*',
    'ول؟',
    '?',
    '*',
    '?-l-*',
    '? l ?'
];

describe('clean()', () => {
    const expected = [
        'ktb',
        'كتب',
        'كتب',
        'sfr',
        'ktb',
        'ktb',
        'ʾmn',
        'ǧrj',
        'ǧrj',
        'dʿ?',
        'dʿ*',
        'ول؟',
        '?',
        '*',
        '?l*',
        '?l?' 
    ];

    const testdata = inputs.map((item, i) => {
        return [item, expected[i]];
    });

    it.each(testdata)(
        'clean(\'%s\') should return %s',
        (input, expected) => {
            expect(clean(input)).toBe(expected);
        }
    );
});

describe('resolveRoot()', () => {
    describe('Defaults', () => {
        const expected = [
            ['roots', 'root_lat', 'ktb'],
            ['roots', 'root_ar', 'كتب'],
            ['roots', 'root_ar', 'كتب'],
            ['roots', 'root_lat', 'sfr'],
            ['roots', 'root_lat', 'ktb'],
            ['roots', 'root_lat', 'ktb'],
            ['roots', 'root_lat', 'ʾmn'],
            ['roots', 'root_lat', 'ǧrj'],
            ['roots', 'root_lat', 'ǧrj'],
            ['roots', 'root_lat', 'dʿ?'],
            ['roots', 'root_lat', 'dʿ*'],
            ['roots', 'root_ar', 'ول؟'],
            ['roots', 'root_lat', '?'],
            ['roots', 'root_lat', '*'],
            ['roots', 'root_lat', '?l*'],
            ['roots', 'root_lat', '?l?']
        ];

        const testdata = inputs.map((item, i) => {
            return [item, expected[i]];
        });

        it.each(testdata)(
            'resolveRoot(%s) should return %s',
            (input, expected) => {
                expect(resolveRoot(input)).toStrictEqual(expected);
            }
        );
    });
});

