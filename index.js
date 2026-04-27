process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning') return;
    console.warn(warning);
});

const Discord = require("discord.js")
const { ActivityType } = require("discord.js")
const intents = new Discord.IntentsBitField(3276799)
const client = new Discord.Client({intents})
const config = require("./config")
const secure = require("./secure/secure")
const loadCommands = require("./Loaders/loadCommands")
const loadEvents = require("./Loaders/loadEvents")
const loadDatabase = require("./Loaders/loadDatabase")

// ✅ Initialisation de la collection AVANT tout chargement
client.commands = new Discord.Collection()








// -------------------- creer un vocal
client.createdChannels = new Set();








// --------------------- Arriver / depart

client.on("guildMemberAdd", async member => {
    try {
        let embedarriver = new Discord.EmbedBuilder()
            .setTitle("Arrivant")
            .setDescription(`Bienvenu à toi <@${member.id}> !\nNous t'invitons a mettre ton **Nom & Prenom RP**\n\n
            Grâce à toi, nous sommes désormais ${member.guild.memberCount} membres !`)
            .setTimestamp()
            .setColor("Green")
            .setThumbnail(member.displayAvatarURL({ size: 128 }));

        let embedDM = new Discord.EmbedBuilder()
            .setTitle("Arrivant")
            .setDescription(`Bienvenu à toi <@${member.id}> !\n`)
            .setTimestamp()
            .setColor("Green")
            .setThumbnail(member.displayAvatarURL({ size: 128 }));

        const btnregle = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("citoyen")
                .setLabel("Je veux être Citoyen")
                .setStyle(Discord.ButtonStyle.Primary)
        );
        const btnDM = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setURL(`https://docs.google.com/document/d/1M4BBRZhIokVX5PAL6AntsUtftT7b1S6Kcm7Uq8sHywU/edit?usp=sharing`)
                .setLabel("voici le reglement")
                .setStyle(Discord.ButtonStyle.Link)
        );

        try {
            await member.send({ embeds: [embedDM], components: [btnDM] });
            const channel2 = client.channels.cache.get(config.Logs);
            if (channel2) {
                await channel2.send(`Bienvenu à toi <@${member.id}>`);
            } else {
                console.log("Channel Logs introuvable.");
            }
            const channel = client.channels.cache.get(config.Aeroport);
            if (channel) {
                await channel.send({ embeds: [embedarriver], components: [btnregle], content: `<@${member.id}>` });
            } else {
                console.log("Channel général introuvable.");
            }

        } catch (dmErr) {
            if (dmErr.code === 50007) {
                console.log(`DMs désactivés pour ${member.user.tag}, envoi dans le général.`);
            } else {
                throw dmErr;
            }
        }

    } catch (err) {
        console.log("Une erreur s'est produite :", err);
    }
});

client.on("guildMemberRemove", async member => {
    try {
        let embedDepart = new Discord.EmbedBuilder()
            .setTitle("Départ")
            .setDescription(`Au revoir <@${member.id}> !`)
            .setTimestamp()
            .setColor("Red")
            .setThumbnail(member.displayAvatarURL({ size: 128 }));

        const channel = client.channels.cache.get(config.Aeroport);
        if (channel) {
            await channel.send({ embeds: [embedDepart] });
        } else {
            console.log(`Le channel spécifié dans ${channel} est introuvable.`);
        }

    } catch (err) {
        console.log("Une erreur s'est produite :", err);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === "rename_modal") {
        const newNickname = interaction.fields.getTextInputValue("new_nickname");

        try {
            await interaction.member.setNickname(newNickname);
            await interaction.reply({ content: `Ton pseudo a été changé en **${newNickname}** !`, ephemeral: true });
            await interaction.member.roles.add(config.Roles.citoyens);
            await interaction.member.roles.remove(config.Roles.Non_Whitelist);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Je n'ai pas la permission de changer ton pseudo.", ephemeral: true });
        }
    }
});











// ----------------------- Rich Presence
const activities = [
    {
        status: 'dnd', // 'online' | 'idle' | 'dnd' | 'invisible'
        name: `Joue a Rainbow RP`,
        type: ActivityType.Playing,
    },
    {
        status: 'idle', // 'online' | 'idle' | 'dnd' | 'invisible'
        name: `Check les tickets`,
        type: ActivityType.Watching,
    },
    {
        status: 'online', // 'online' | 'idle' | 'dnd' | 'invisible'
        name: () => {
            const guild = client.guilds.cache.get(config.guildId);
            return `Regarde ${guild?.memberCount ?? 0} membres`;
        },
        type: ActivityType.Watching,
    },
];

let currentIndex = 0;

function updatePresence() {
    const activity = activities[currentIndex];
    const name = typeof activity.name === 'function' ? activity.name() : activity.name;

    client.user.setPresence({
        status: activity.status,
        activities: [
            {
                name: name,
                type: activity.type,
            }
        ]
    });

    //console.log(`🔄 Statut mis à jour : ${name} (${activity.status})`);
    currentIndex = (currentIndex + 1) % activities.length;
}













// ----------------------- touche pas a ca
client.once('ready', () => {
    updatePresence();
    setInterval(updatePresence, 60_000);
});

client.login(secure.token)
loadCommands(client)
loadEvents(client)