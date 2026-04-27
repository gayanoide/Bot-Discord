const Discord = require("discord.js")


module.exports = async (client, member) => {

    let db = client.db;

    db.query(`SELECT * FROM server WHERE guild = '${member.guild.id}'`, async (err, req) => {

        if(req.length < 1) return;

        if(req[0].antiraid === "true") {

            try {await member.user.send("Vous ne pouvez pas rejoindre le serveur car il est en mode antiraid")} catch(err) {}
            await member.kick("Antiraid")
        }
    })
    
};