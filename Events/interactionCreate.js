const Discord = require("discord.js")
const { EmbedBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js")
const discordTranscripts = require("discord-html-transcripts");
const config = require("../config");


module.exports = async (client, interaction, message) => {

    let db = client.db;
if(interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete){

    let entry = interaction.options.getFocused()

    if(interaction.commandName === "help") {
try{
    let choices = client.commands.filter(cmd => cmd.name.includes(entry))
    await interaction.respond(entry === "" ? client.commands.map(cmd => ({name : cmd.name, value: cmd.name})) : choices.map(choice => ({name: choice, value: choice})))
}catch (err){
    console.log(err)
}




}

 }

if(interaction.type === Discord.InteractionType.ApplicationCommand){

            const command = client.commands.get(interaction.commandName);
            command.run(bot, interaction, interaction.options, client.db)
        }

    if(interaction.isButton()) {
        if (interaction.customId === "citoyen") {
            if (interaction.member.roles.cache.has(config.Roles.citoyens)) {
                return await interaction.reply({ content: "Tu as déjà reçu le rôle !", ephemeral: true });
            }
        
            // Vérifier si l'utilisateur a déjà un pseudo défini
            if (!interaction.member.nickname) {
                // Création du modal
                const modal = new ModalBuilder()
                    .setCustomId("rename_modal")
                    .setTitle("Renomme-toi");
        
                // Champ pour entrer le pseudo
                const nameInput = new TextInputBuilder()
                    .setCustomId("new_nickname")
                    .setLabel("Entre ton Nom et Prénom RP")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);
        
                // Ajout du champ dans le modal
                const row = new ActionRowBuilder().addComponents(nameInput);
                modal.addComponents(row);
        
                // Affichage du modal
                return await interaction.showModal(modal);
            }
        
            // Si le pseudo est déjà défini, on donne le rôle directement
            await interaction.member.roles.add(config.Roles.citoyens);
            await interaction.reply({ content: "Tu as reçu le rôle avec succès.", ephemeral: true });
        }
        

        if(interaction.customId === "question"){
            let AlreadyAChannel = interaction.guild.channels.cache.find(c => c.topic == 'question ' + interaction.user.id);

            if(AlreadyAChannel) return interaction.reply({content: "Vous avez déjà un ticket ouvert !", ephemeral: true})

                let channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: Discord.ChannelType.GuildText,
                })
                await channel.setParent(config.ticket_categorie)
    
                await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                    ViewChannel: false
                })
                await channel.permissionOverwrites.create(interaction.user, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true,
                    AttachFiles: true,
                    EmbedLinks: true
                })
                await channel.permissionOverwrites.create(config.ticket_roles, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true,
                    AttachFiles: true,
                    EmbedLinks: true
                })
    
                await channel.setTopic(interaction.user.id)
                //await interaction.reply({content: `Votre ticket a été créé ici : ${channel}`, ephemeral: true})
                
                let embedcreeticket = new Discord.EmbedBuilder()
                //.setTitle(``)
                .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
                .setDescription(`Bonjour <@${interaction.user.id}> ✌️
                    Merci de nous indiquer les choses suivantes:

                    ➥ Nom & Prénom:
                    ➥ Entreprise:
                    ➥ Rôle:
                    ➥ Numéro de téléphone:
                    ➥ Votre demande:
                    
                    `)
                //.setTimestamp()
                //.setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
    
                const btnticketfermer = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
                .setCustomId("close")
                .setLabel("Fermer le ticket")
                .setStyle(Discord.ButtonStyle.Danger)
                .setEmoji("🗑️"))
                await channel.send({embeds: [embedcreeticket], components: [btnticketfermer], content: `|| <@&${config.ticket_roles}> <@${interaction.user.id}>||`});
                //await channel.send({ content: `<@${interaction.user.id}>`})
            }           

        if(interaction.customId === "close") {

            let modal = new Discord.ModalBuilder()
            .setCustomId('closemodal')
            .setTitle("Création d'un ticket")

            const raisonclose = new Discord.TextInputBuilder() // maximum 1
            .setCustomId('raisonclose')
            .setLabel("Raison(s) de cloture")
            .setPlaceholder("Fermeture")
            .setMinLength(1)
            .setRequired(true)
            .setStyle(Discord.TextInputStyle.Short)


            let firstrow = new Discord.ActionRowBuilder().addComponents(raisonclose);

            modal.addComponents(firstrow);

            await interaction.showModal(modal);
        }
        

    }

    if(interaction.isModalSubmit()) {

        if(interaction.customId === "ticket_modal") {
 
                let sujet = interaction.fields.getTextInputValue('firstinput');
                let probleme = interaction.fields.getTextInputValue('secondinput');
                const channelticket = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    parent: config.Categorie_Ticket,
                    type: 0,
                    permissionOverwrites: [
                        
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"],
                        },
                        {
                            id: interaction.user.id,
                            allow: ["ViewChannel", "SendMessages", "AttachFiles", "EmbedLinks", "AddReactions"],
                        },
                        {
                            id: client.user.id,
                            allow: ["ViewChannel", "SendMessages", "AttachFiles", "EmbedLinks", "AddReactions"],
                        },
        
                    ],
                    
                }).then(async (channel) => {
                    await channel.setTopic(interaction.user.id)
                    const btnticketfermer = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
                    .setCustomId("close")
                    .setLabel("Fermer le ticket")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji("🗑️"))
                    
                    let embed = new Discord.EmbedBuilder()
                    .setColor('#ffffff')
                    .setTitle("Ticket")
                    .setDescription(`**Sujet:** ${sujet}\n**Problème:** ${probleme}`)
                    .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                    .setTimestamp()
                    interaction.reply({content: `Ton ticket est ici <#${channel.id}>`, ephemeral: true})
        
                    channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [btnticketfermer]});
        
                });
            }
            if (interaction.customId === 'closemodal') {
                const raisonclose = interaction.fields.getTextInputValue('raisonclose');
                const userId = interaction.channel.topic;
                const user = client.users.cache.get(userId);
                const channel = interaction.channel;

                await interaction.reply({ content: `Préparation du transcript`, ephemeral: true });

                const transticket = await discordTranscripts.createTranscript(channel);

                try {
                    // Récupération de l'ouvreur du ticket via le topic du salon
                    const ticketOpener = await client.users.fetch(userId).catch(() => null);
                    const openerTag = ticketOpener ? ticketOpener.tag : 'Inconnu';

                    const embed_ticket_close_mp = new EmbedBuilder()
                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                        .setTitle('Votre ticket a été fermé !')
                        .addFields({ name: 'Personne qui a ouvert :', value: openerTag })
                        .addFields({ name: 'Personne qui a fermé :', value: interaction.user.tag })
                        .addFields({ name: 'Raison(s) :', value: raisonclose });

                    // Envoi en MP à l'utilisateur
                    if (user) await user.send({ embeds: [embed_ticket_close_mp] });

                    // Envoi dans le salon de logs
                    const targetChannel = client.channels.cache.get(config.Logs);
                    if (targetChannel) {
                        await targetChannel.send({ embeds: [embed_ticket_close_mp], files: [transticket] });
                    } else {
                        console.error('Le canal de logs est introuvable.');
                    }
                } catch (err) {
                    console.error(err);
                }

                await interaction.channel.delete();
            }
        }
}