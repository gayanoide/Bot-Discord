const Discord = require("discord.js");
const loadSlashCommands = require("../Loaders/loadSlashCommands");
const loadDatabase = require("../Loaders/loadDatabase");
const config = require("../config");

module.exports = async (client) => {
    // Connexion base de données
    client.db = await loadDatabase();
    console.log("=====================================================");
    console.log(`==     Connection à la base de données réussie     ==`);    
    console.log("==                                                 ==");
    //console.log("=====================================================");

    // Vérification des guilds en base de données
    client.guilds.cache.forEach(guild => {
        client.db.query(`SELECT * FROM server WHERE guild = '${guild.id}'`, (err, req) => {
            if (err) return console.error('Erreur SELECT:', err);
            
            if (req.length < 1) {
                client.db.query(`INSERT INTO server (guild) VALUES ('${guild.id}')`, (err2) => {
                    if (err2) console.error('Erreur INSERT:', err2);
                    else console.log(`✅   Guild ${guild.name} (${guild.id}) ajoutée en base.`);
                });
            } else {
                console.log("==                \x1B[32mGuild déjà en base.              \x1B[0m==");
                console.log("==                                                 ==");
                //console.log("=====================================================");
            }
        });
    });

    // ---- Nettoyage des vocaux vides au démarrage ----
    client.guilds.cache.forEach(guild => {
        client.db.query(`SELECT * FROM privatevoc WHERE guildID = '${guild.id}'`, async (err, req) => {
            if (err || !req || req.length < 1) return;

            const channelID = req[0].channelID;
            const categoryID = req[0].categoryID;

            const vocaux = guild.channels.cache.filter(c =>
                c.parentId === categoryID &&
                c.type === 2 &&
                c.id !== channelID
            );

            vocaux.forEach(async vocal => {
                if (vocal.members.size === 0) {
                    await vocal.delete();
                    console.log(`🗑️   Vocal vide supprimé au démarrage : ${vocal.name}`);
                } else {
                    client.createdChannels.add(vocal.id);
                    console.log(`♻️   Vocal récupéré au démarrage : ${vocal.name}`);
                }
            });
        });
    });
    // -------------------------------------------------

    await loadSlashCommands(client);

    let allcommands = [];
    client.commands.forEach(command => 
        allcommands.push({ commandName: command.name, commandDescription: command.description })
    );
    
    console.log(`==         \x1B[32m${client.user.tag}\x1B[0m est bien allumé         \x1B[0m==`);
    console.log(`==                                                 ==`);
    console.log(`==        🌍   Connecté à \x1B[32m${client.guilds.cache.size}\x1B[0m serveurs Discord        ==`);
    //console.log("=====================================================");
    console.log("==                                                 ==");

    client.guilds.cache.forEach(guild => {
        console.log(`==              ${guild.name} (\x1B[33m${guild.memberCount}\x1B[0m membres)            ==`);
        console.log("=====================================================");
        
    });

    // Canal de logs
    const channel = client.channels.cache.get(config.Logs);

    if (!channel) {
        console.error(`\x1B[31mCANAL LOGS non trouvé ❌ \x1B[0mVérifiez l'ID du canal dans le fichier config.`);
        return;
    }

    // Message de démarrage
    await channel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(`${channel.guild.name}`)
                .setColor("Green")
        ]
    });

    // Status du bot (mise à jour toutes les minutes)
    //setInterval(() => {
    //    client.user.setActivity(`surveille ${client.users.cache.size} membres`, { type: Discord.ActivityType.Watching });
    //}, 1 * 60 * 1000);

    
};