const Discord = require("discord.js");
const config = require("../config");

module.exports = {
    name: "commande",
    description: "Affiche la liste des commandes disponibles.",
    dm: false,
    category: "Général",

    async run(bot, interaction) {
        try {
            // Récupérer toutes les commandes
            const allCommands = bot.commands;

            // Vérifier si des commandes existent
            if (!allCommands || allCommands.size === 0) {
                return await interaction.reply({ 
                    content: "Aucune commande n'est disponible pour le moment.", 
                    ephemeral: true 
                });
            }

            // Classer par catégories
            const categories = {};

            allCommands.forEach(cmd => {
                const category = cmd.category || "Sans catégorie";
                if (!categories[category]) {
                    categories[category] = [];
                }
                categories[category].push(cmd);
            });

            // Construire l'embed
            const helpEmbed = new Discord.EmbedBuilder()
                .setColor("#2b2d31")
                .setTitle("📚 Liste des commandes disponibles")
                .setDescription("Voici les commandes que tu peux utiliser :")
                .setTimestamp();

            // Ajout des catégories + commandes avec séparation
            const categoryNames = Object.keys(categories);
            
            categoryNames.forEach((categoryName, index) => {
                let commandList = "";

                categories[categoryName].forEach(cmd => {
                    commandList += `**/${cmd.name}** → *${cmd.description || "Aucune description"}*\n`;
                });

                helpEmbed.addFields({
                    name: `📦 ${categoryName}`,
                    value: commandList.trim(),
                    inline: false
                });

                // Ajouter un séparateur visuel entre les catégories (sauf pour la dernière)
                if (index < categoryNames.length - 1) {
                    helpEmbed.addFields({
                        name: "\u200B", // Caractère invisible
                        value: "───────────────────────",
                        inline: false
                    });
                }
            });

            // Envoyer en MP
            try {
                await interaction.user.send({ embeds: [helpEmbed] });
                
                // Confirmer l'envoi en MP
                await interaction.reply({ 
                    content: "📬 Je t'ai envoyé la liste des commandes en message privé !", 
                    ephemeral: true 
                });
            } catch (dmError) {
                // Si l'envoi en MP échoue (MP fermés)
                await interaction.reply({ 
                    content: "❌ Je ne peux pas t'envoyer de message privé. Vérifie que tes MP sont ouverts !", 
                    ephemeral: true 
                });
            }

        } catch (err) {
            console.error("Erreur dans la commande cmd:", err);
            
            // Gérer l'erreur proprement pour l'utilisateur
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: "Une erreur s'est produite lors de l'affichage des commandes.", 
                    ephemeral: true 
                });
            }
        }
    }
};