const mysql = require("mysql");
const secure = require("../secure/secure");

module.exports = async () => {
    const db = mysql.createConnection({
        host: secure.host_bdd,
        user: secure.user,
        password: secure.password,
        database: secure.database
    });

    return new Promise((resolve, reject) => {
        db.connect((err) => {
            if (err) {
                console.error("❌ Erreur connexion MySQL :", err);
                reject(err);
            } else {
                //console.log("❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌ ❌");
                //console.log("==     Connexion à la base de données réussie     ==");
                resolve(db);
            }
        });
    });
};