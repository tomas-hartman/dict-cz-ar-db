function getCleanVal(val) {
    if(val.trim() === '') return undefined;
    
    let output = val.replace(/\u0640{2,}/g, 'ـ');

    return output;
}

module.exports = {getCleanVal};
