const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "unban",
    description: `Débannir une personne.`,
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "string",
            name: "id",
            description: "ID de l'utilisateur à débannir.",
            required: true,
            autocomplete: true // Activé
        },
    ],

    async autocomplete(interaction) {
        try {
            const bannedUsers = await interaction.guild.bans.fetch();
            
            // Récupérer la recherche actuelle de l'utilisateur
            const focusedValue = interaction.options.getFocused().toLowerCase();
            
            // Filtrer et mapper les utilisateurs bannis
            const choices = bannedUsers
                .filter(ban => {
                    // Filtrer par nom ou ID si l'utilisateur tape quelque chose
                    if (!focusedValue) return true;
                    return ban.user.tag.toLowerCase().includes(focusedValue) || 
                           ban.user.id.includes(focusedValue);
                })
                .map(ban => ({
                    name: `${ban.user.tag} (${ban.user.id})`,
                    value: ban.user.id
                }))
                .slice(0, 25); // Discord limite à 25 choix maximum
            
            await interaction.respond(choices);
        } catch (err) {
            console.error("Erreur autocomplete unban:", err);
            await interaction.respond([]);
        }
    },

    async run(bot, interaction) {  
        const userId = interaction.options.getString("id");

        // Validation de l'ID Discord (18-19 chiffres)
        if (!/^\d{17,19}$/.test(userId)) {
            return interaction.reply({ 
                content: "❌ L'ID fourni n'est pas valide. Un ID Discord contient 17-19 chiffres.", 
                ephemeral: true 
            });
        }

        try {  
            // Vérifier si l'utilisateur est banni
            const bannedUsers = await interaction.guild.bans.fetch();  
            const bannedUser = bannedUsers.get(userId);  

            if (!bannedUser) {  
                return interaction.reply({ 
                    content: "❌ Cet utilisateur n'est pas banni sur ce serveur.", 
                    ephemeral: true 
                });  
            }

            // Débannir l'utilisateur
            await interaction.guild.members.unban(userId);

            // Embed pour le modérateur (réponse privée)
            const replyEmbed = new EmbedBuilder()  
                .setTitle("🔓 Membre débanni")  
                .setColor("Green")  
                .setDescription(`**${bannedUser.user.tag}** (\`${userId}\`) a été débanni avec succès.`)  
                .setTimestamp();  

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true });

            // Envoyer un DM à l'utilisateur débanni
            try {  
                await bannedUser.user.send(
                    `🎉 Salut **${bannedUser.user.tag}** !\n\n` +
                    `Tu as été débanni du serveur **${interaction.guild.name}**.\n` +
                    `Voici un nouveau lien pour nous rejoindre : ${config.invite}`
                );  
            } catch (dmErr) {  
                console.warn(`⚠️ Impossible d'envoyer un DM à ${bannedUser.user.tag} (${userId}).`);  
            }

            // Embed pour le channel de logs
            const logsEmbed = new EmbedBuilder()  
                .setTitle("🧾 Journal de modération — Unban")  
                .setColor("Green")  
                .addFields(  
                    { name: "👤 Utilisateur débanni", value: `${bannedUser.user.tag} (\`${userId}\`)`, inline: false },  
                    { name: "🛠️ Modérateur", value: `<@${interaction.user.id}>`, inline: false }  
                )  
                .setTimestamp();  

            const logsChannel = interaction.guild.channels.cache.get(config.Logs);
            if (logsChannel) {  
                await logsChannel.send({ embeds: [logsEmbed] });  
            } else {  
                console.warn("⚠️ Le salon de logs défini dans le config est introuvable.");  
            }  

        } catch (err) {  
            console.error("Erreur lors du unban:", err);
            
            // Vérifier si on a déjà répondu
            const errorMessage = { 
                content: "❌ Une erreur est survenue lors du débannissement.", 
                ephemeral: true 
            };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage).catch(() => {});
            } else {
                await interaction.reply(errorMessage).catch(() => {});
            }
        }  
    }  
};