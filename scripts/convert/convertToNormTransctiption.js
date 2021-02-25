const conversionTable = require("./conversionTable");
const readfile = require("../readfile");
const path = require("path");

const getInterdentalsInRoot = (root) => {
    const rootArr = root.split("-");

    return rootArr.filter((radical) => {
        return radical === "th" || radical === "dh";
    })
}

const convertToNormTranscription = (text, root) => {

    // check root, if it has dh, th, pokud ne, konvert normálně
    // jinak promyslím následně
    if(!root || getInterdentalsInRoot(root) === 0){
        // todo normal good case
    } 
}

const convertWrapperCb = (data) => {
    const [ar, val, cz, root, syn, example, transcription, tags] = data;
}

const file = path.join(__dirname, "../../output/roots.txt");

// readfile(file, convertRoot);

console.log(getInterdentalsInRoot("th-dh-r"));
console.log(getInterdentalsInRoot("t-dh-r"));
console.log(getInterdentalsInRoot("t-d-dh"));
console.log(getInterdentalsInRoot("t-h-q"));