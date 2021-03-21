const { convertVocabLine } = require('./scripts/convertVocab/convertVocab');
const { resolveRoot } = require('./scripts/convertVocab/resolveRoot');
const { resolveWord } = require('./scripts/convertVocab/resolveWord');


// const extractAttributes = (arr, matcher) => {
//     const idsToDelete = [];
//     const output = arr.filter((tag, id) => {
//         console.log(tag);
//         if(tag.match(matcher)){
//             // console.log(tag);
//             idsToDelete.push(id);
//             return true;
//         }
//     });

//     idsToDelete.forEach((id) => {
//         arr.splice(id, 1);
//     });

//     return output;
// };

// const tags = 'AR_1.rocnik AR_lekce_7 AR_muj_slovnicek_1 cat_substantiva opakovani_zapomenutych ostatní slovnik_151-160';
// const ar = 'نِسْبَةٌ (نِسَبٌ)';
// console.log('Roztřízené: ', extractAttributes(tags, /^AR_|^text_|Hosnoviny|Ondrášoviny|slovnik_|^tema_/g));


const str = 'نِسْبَةٌ (نِسَبٌ)		vztah, příbuznost (1); poměr, procento, míra (2); měřítko (3)	n-s-b		نسبة البِطَالة (míra nezaměstnanosti)	nisbatun, nisabun	AR_1.rocnik AR_lekce_7 AR_muj_slovnicek_1 cat_substantiva opakovani_zapomenutych ostatní slovnik_151-160';
const verbStr = 'قام (ـُ) قِيامٌ/قَوْمٌ {3}		stát, vstát, postavit se (1); odjet dopravním prostředkem (2)	q-w-m		قَامَ مِنَ ٱلنَّوْمِ vstávat	qáma (jaqúmu)	AR_muj_slovnicek_2 cat_slovesa I_kmen IIaeW/J slaba_slovesa';

// const root = 'S-n-3';
// const resolvedRoot = resolveRoot(root);

const arrFromStr = str.split('\t');

console.log('Origin:\n', str, '\n');

(async () => {
    const output = await convertVocabLine(verbStr);
    
    console.log('Output:', output);
})();

// resolveWord(arrFromStr);
