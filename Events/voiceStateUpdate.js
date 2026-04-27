const Discord = require('discord.js');
const config = require("../config");

module.exports = async (client, oldState, newState) => {
    const db = client.db;

    db.query(`SELECT * FROM privatevoc WHERE guildID = '${newState.guild.id}'`, async (err, req) => {
        if (err) return console.error(`❌ Erreur SQL:`, err);
        if (!req || req.length < 1) return console.log(`❌ Aucune config trouvée pour le guild ${newState.guild.id}`);

        const guild = newState.guild;
        const channelID = req[0].channelID;
        const categoryID = req[0].categoryID;
        const channelID2 = req[0].channelID2;
        const categoryID2 = req[0].categoryID2;
        const logChannel = client.channels.cache.get(config.Logs);

        //console.log(`🔊 Event déclenché - newChannel: ${newState.channelId} | channelID config: ${channelID}`);

        // ---- Vocal principal ----
        if (newState.channelId === channelID) {
            const memberName = newState.member.displayName;

            try {
                const createdChannel = await guild.channels.create({
                    type: 2,
                    name: `${memberName}`,
                    parent: categoryID,
                    permissionOverwrites: [
                        {
                            id: newState.member.id,
                            allow: [
                                Discord.PermissionFlagsBits.Connect,
                                Discord.PermissionFlagsBits.Speak,
                                Discord.PermissionFlagsBits.ViewChannel
                            ]
                        },
                        {
                            id: guild.roles.everyone,
                            allow: [
                                Discord.PermissionFlagsBits.ViewChannel,
                                Discord.PermissionFlagsBits.Connect
                            ]
                        },
                    ],
                });

                await newState.setChannel(createdChannel);
                client.createdChannels.add(createdChannel.id);
                //console.log(`✅ Vocal créé pour ${memberName}`);
                if (logChannel) 
                    await logChannel.send(`✅ Vocal créé pour ${memberName}`);

            } catch (err) {
                console.error(`❌ Erreur création vocal:`, err);
            }

        // ---- Vocal BDA (limite 2) ----
        } else if (newState.channelId === channelID2) {
            const memberName = newState.member.displayName;

            try {
                const createdChannel = await guild.channels.create({
                    type: 2,
                    name: `BDA ${memberName}`,
                    parent: categoryID2,
                    userLimit: 2,
                    permissionOverwrites: [
                        {
                            id: newState.member.id,
                            allow: [
                                Discord.PermissionFlagsBits.Connect,
                                Discord.PermissionFlagsBits.Speak,
                                Discord.PermissionFlagsBits.ViewChannel
                            ]
                        },
                        {
                            id: guild.roles.everyone,
                            allow: [Discord.PermissionFlagsBits.ViewChannel],
                            deny: [Discord.PermissionFlagsBits.Connect]
                        },
                    ],
                });

                await newState.setChannel(createdChannel);
                client.createdChannels.add(createdChannel.id);
                //console.log(`✅ Vocal BDA créé pour ${memberName}`);
                if (logChannel) 
                    await logChannel.send(`✅ Vocal **BDA** créé pour ${memberName}`);

            } catch (err) {
                console.error(`❌ Erreur création vocal BDA:`, err);
            }

        // ---- Suppression si vide ----
        } else if (oldState.channelId && oldState.channelId !== channelID && oldState.channelId !== channelID2) {
            const oldChannel = guild.channels.cache.get(oldState.channelId);
            if (oldChannel && oldChannel.members.size === 0 && client.createdChannels.has(oldChannel.id)) {
                client.createdChannels.delete(oldChannel.id);
                await oldChannel.delete();
                //console.log(`🗑️ Vocal supprimé : ${oldChannel.name}`);
                if (logChannel) 
                    await logChannel.send(`🗑️ Vocal supprimé : ${oldChannel.name}`);
            }
        }
    });
}