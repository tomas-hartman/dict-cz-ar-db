const { convertVocab } = require('./scripts/convertVocab/convertVocab');


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

// const tags = 'AR_1.rocnik AR_lekce_7 AR_muj_slovnicek_1 cat_substantiva opakovani_zapomenutych ostatní slovnik_151-160'.split(' ');
// console.log('Roztřízené: ', extractAttributes(tags, /^AR_|^text_|Hosnoviny|Ondrášoviny|slovnik_|^tema_/g));


const str = 'نِسْبَةٌ (نِسَبٌ)		vztah, příbuznost (1); poměr, procento, míra (2); měřítko (3)	n-s-b		نسبة البِطَالة (míra nezaměstnanosti)	nisbatun, nisabun	AR_1.rocnik AR_lekce_7 AR_muj_slovnicek_1 cat_substantiva opakovani_zapomenutych ostatní slovnik_151-160';

console.log('Origin:\n', str, '\n');

(async () => {
    const output = await convertVocab(str);
    
    console.log('Output:', output);
})();
