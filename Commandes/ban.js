const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");
//const db = require("../secure/secure");

module.exports = {
    name: "ban",
    description: `Banir une personne.`,
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "user", // Changé de "mentionable" à "user"
            name: "qui",
            description: "Qui ?",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "raison",
            description: "Raison ?",
            required: true,
            autocomplete: false
        },
    ],

    async run(bot, interaction) {        
        const user = interaction.options.getUser("qui");
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        const reason = interaction.options.getString("raison");

        // Vérifications de sécurité
        if (!member) {
            return interaction.reply({ content: "❌ Membre introuvable dans le serveur.", ephemeral: true });
        }

        if (member.id === interaction.user.id) {
            return interaction.reply({ content: "❌ Vous ne pouvez pas vous bannir vous-même.", ephemeral: true });
        }

        if (member.id === bot.user.id) {
            return interaction.reply({ content: "❌ Je ne peux pas me bannir moi-même.", ephemeral: true });
        }

        if (!member.bannable) {
            return interaction.reply({ content: "❌ Je ne peux pas bannir ce membre (permissions insuffisantes ou rôle supérieur).", ephemeral: true });
        }

        try {
            // Méthode correcte pour bannir
            await interaction.guild.members.ban(user.id, { reason });

            //await db.query("INSERT INTO bans (user_id) VALUES (?)", [user.id]);

            // Embed pour le modérateur
            const embed = new EmbedBuilder()
                .setTitle("Membre banni ✅")
                .setColor("Red")
                .setDescription(`**${user.tag}** a été banni.\n**Raison :** ${reason}`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

            // Embed pour le channel de logs
            const logsEmbed = new EmbedBuilder()
                .setTitle("🧾 Journal de modération — Ban")
                .setColor("Red")
                .addFields(
                    { name: "👤 Utilisateur banni", value: `<@${user.id}>`, inline: false },
                    { name: "🛠️ Modérateur", value: `<@${interaction.user.id}>`, inline: false },
                    { name: "📄 Raison", value: reason, inline: false }
                )
                .setTimestamp();

            const logsChannel = interaction.guild.channels.cache.get(config.Logs);
            if (logsChannel) {
                await logsChannel.send({ embeds: [logsEmbed] });
            } else {
                console.warn("⚠️ Le salon de logs défini dans le config est introuvable.");
            }

        } catch (err) {
            console.error(err);
            await interaction.reply({ content: "❌ Une erreur est survenue lors du ban.", ephemeral: true }).catch(() => {});
        }
    }
};