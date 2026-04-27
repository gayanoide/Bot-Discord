module.exports = async (client, guild) => {

    let db = client.db;

    db.query(`SELECT * FROM server WHERE guild = '${guild.id}'`, async (err, req)=> {

        if(req.length < 1){
        db.query(`INSERT INTO server (guild) VALUES (${guild.id})`)
        }
    })
};