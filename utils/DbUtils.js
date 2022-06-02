

module.exports.AddAlternativePromiseFunctions = (db) => {

    db.pget = (sql, params) => {

        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if(err) {
                    reject(err)
                }
                else{
                    resolve(row)
                }
            });
        });
    };

    db.prun = (sql, params) => {

        return new Promise((resolve, reject) => {
            db.run(sql, params, (err) => {
                if(err == null) {
                    resolve()
                }
                else{
                    reject(err)
                }
            });
        });
    };
}