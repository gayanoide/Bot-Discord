const Discord = require("discord.js")
const { EmbedBuilder } = require("discord.js")


module.exports = async(client, message) => {
    let db = client.db;
    if(message.author.bot || message.channel.type === Discord.ChannelType.DM) return;
    
    db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req) => {

        if(req[0].antispam === "true") await client.function.searchSpam(message)
    })




    // db.query(`SELECT * FROM suggestion WHERE guild = '${message.guild.id}'`, async (err, req) => {
    
    //     if(message.channel.id === req[0].channel) {
    //         let suggEmbed = new EmbedBuilder()
    //         .setColor("Red")
    //         .setTitle("Suggestion")
    //         .setDescription(`${message.content}`)
    //         .setThumbnail(message.author.displayAvatarURL({ dynamic: true}))
    //         .addFields({ name: "Proposé par:", value: `${message.author}`, inline: true})
    //         client.channels.cache.get(req[0].channel).send({ embeds: [suggEmbed]}).then(msg => {
    //             msg.react("✅")
    //             msg.react("❌")
    //             msg.startThread({name: `Suggestion de ${message.author.username}`});
    //         });
    //         await message.delete()
    //     };
    // });
}