const {getWhereClause} = require('../../src/search/getWhereClause'); 

describe('getWhereClause', () => {
    describe('Defaults', () => {
        describe('Defaults lat', () => {
            const inputs = [
                ['roots', 'root_lat', 'ktb'],
                ['roots', 'root_lat', 'sfr'],
                ['roots', 'root_lat', 'ktb'],
                ['roots', 'root_lat', 'ktb'],
                ['roots', 'root_lat', 'ʾmn'],
                ['roots', 'root_lat', 'ǧrj'],
                ['roots', 'root_lat', 'ǧrj'],
            ];
    
            const expected = [
                'ktb',
                'sfr',
                'ktb',
                'ktb',
                'ʾmn',
                'ǧrj',
                'ǧrj',
            ];
    
            const testdata = inputs.map((item, i) => {
                return [item, expected[i]];
            });
    
            it.each(testdata)(
                'getWhereClause(%s) should return ',
                (input, expected) => {
                    expect(getWhereClause(input)).toBe(`root_lat = '${expected}'`);
                }
            );
        });

        describe('Defaults: ar', () => {
            const inputs = [
                ['roots', 'root_ar', 'كتب'],
                ['roots', 'root_ar', 'كتب'],
            ];

            const expected = [
                'كتب',
                'كتب',
            ];

            const testdata = inputs.map((item, i) => {
                return [item, expected[i]];
            });
    
            it.each(testdata)(
                'getWhereClause(%s) should return ',
                (input, expected) => {
                    expect(getWhereClause(input)).toBe(`root_ar = '${expected}'`);
                }
            );
        });
    });

    describe('Wildcards', () => {
        const inputs = [
            ['roots', 'root_lat', 'dʿ?'],
            ['roots', 'root_lat', 'dʿ*'],
            ['roots', 'root_ar', 'ول؟'],
        ];

        const expected = [
            'root_lat = \'dʿj\' OR root_lat = \'dʿw\' OR root_lat = \'dʿʾ\'',
            'root_lat GLOB \'dʿ*\'',
            'root_ar = \'ولي\' OR root_ar = \'ولو\' OR root_ar = \'ولء\'',
        ];

        const testdata = inputs.map((item, i) => {
            return [item, expected[i]];
        });

        it.each(testdata)(
            'getWhereClause(%s) should return ',
            (input, expected) => {
                expect(getWhereClause(input)).toBe(expected);
            }
        );
    });
    
    describe('Fail cases', () => {
        const inputs = [
            [['roots', 'root_ar', '?']],
            [['roots', 'root_ar', '*']],
            [['roots', 'root_ar', '?l*']],
            [['roots', 'root_ar', '?l?']]
        ];

        it.each(inputs)(
            'getWhereClause(%s) should end up in an error',
            (input) => {
                expect(() => getWhereClause(input)).toThrow();
            }
        );
    });
});