module.exports = async (client, queue, track) => {

    queue.metadata.message.channel.send(`Salut la musique ${track.title} est start !`)
}