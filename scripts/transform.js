/**
 * Transforms proccessed output into csv formatted output ready to be imported into db
 */
const fs = require("fs");
const path = require("path");
const readfile = require("./readfile");
const ObjectsToCsv = require('objects-to-csv');

const filename = "Arabi__01__rocnik";
const inputFileName = path.resolve(__dirname, "../raw/" + filename + ".txt");
const outputFileName = path.resolve(__dirname, "../output/" + filename + "__processed.txt");
const writeStream = fs.createWriteStream(outputFileName);

function resolveTags(tagsString) {
    const tagsArr = tagsString.split(" ");

    const categories = [
        "slovesa", 
        "substantiva", 
        "předložky", 
        "zájmena", 
        "spojky", 
        "číslovky", 
        "adjektiva", 
        "adverbia", 
        "fráze"
    ];

    const stems = [
        "I_kmen",
        "II_kmen",
        "III_kmen",
        "IV_kmen",
        "V_kmen",
        "VI_kmen",
        "VII_kmen",
        "VIII_kmen",
        "IX_kmen",
        "X_kmen",
        "4_I_kmen",
        "4_II_kmen",
        "4_IV_kmen",
    ]

    const outputCategory = [];
    const outputStem = [];

    const tags = tagsArr.filter((item, id) => {
        if(categories.find((category) => item === category)) {
            outputCategory.push(item);
            return false;
        }

        if(stems.find(stem => item === stem )){
            outputStem.push(item);
            return false;
        }

        return true;

    });

    const output = {
        tags: tags.join(" "),
        category: outputCategory.join(" "),
        source: null, // @todo
        disabled: "false", // @todo: tag: is-disabled
        stem: outputStem.join(" "),
    }

    return output;
}

// const a = "AR_1.rocnik AR_muj_slovnicek_1 lidé opakovani_zapomenutych profese substantiva";
// const b = "AR_lekce_3 AR_muj_slovnicek_1 III_kmen slovesa";

// console.log(resolveTags(b));

async function convertFile(data) {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;

    const {tags: _tags, category, source, disabled, stem} = resolveTags(tags)
    // resolveAr() // checks data for plural, masdar, stem_vowel

    const output = {
        ar,
        cz,
        norm: "",
        cat_id: category,
        root_id: root,
        stem: stem,
        stem_vowel: null,
        plural: null,
        masdar: null,
        val,
        transcription,
        meaning_variant: null,
        synonyms_ids: syn,
        tags: _tags,
        examples_ids: example,
        source,
        disabled,
    }


    // console.log();
    const csvOutput = await new ObjectsToCsv([output]).toString(false);

    // console.log(csvOutput)
    writeStream.write(csvOutput);

    // console.log(output)
}

readfile(inputFileName, convertFile);

