const { db } = require('../dbconnect/prepareRootTable');

async function resolveRoot(rootStr) {
    if(rootStr.trim() === '') return {root: undefined};

    const getRootId = async (rootStr) => {
        let output;
        // open db and look to table __table for id of category
        db.serialize(() => {
            const sql = `
                SELECT id FROM roots
                WHERE root_origin = $root
            `;

            output = new Promise((resolve, reject) => {
                db.get(sql, {$root: rootStr}, (err, result) => {
                    if(err) reject(err);

                    const {id} = result;

                    resolve(id);
                });
            });
        });

        return output;
    };

    const rootId = await getRootId(rootStr);
    const output = { rootId };

    return output;
}

module.exports = {resolveRoot};