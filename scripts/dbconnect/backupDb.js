const fs = require('fs');
const path = require('path');

const backupDb = () => {
    const dbName = 'dictionary_1.0.0.db';
    const pathToDb = path.resolve(__dirname, '../../db', dbName);

    const d = new Date();
    const o = (number) => {
        if(number < 10) return '0' + number;

        return number.toString();
    };
    const timestamp = [
        o(d.getFullYear()), 
        o(d.getMonth() + 1), 
        o(d.getDate()), 
        o(d.getUTCHours()), 
        o(d.getUTCMinutes()), 
        o(d.getUTCSeconds())].join('');

    const {ext, name, dir} = path.parse(pathToDb);
    const newDbName = `${name}_${timestamp}${ext}`;

    const pathToBackupDb = path.join(dir, 'backups', newDbName);

    try {
        fs.copyFileSync(pathToDb, pathToBackupDb);
        console.log(`Backup created at ${pathToBackupDb}`);
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = {backupDb};