const config = require('../config');

module.exports = async (client, oldPresence, newPresence) => {
    if (!oldPresence) return;
    if (!newPresence.member) return;

    try {
        const isStreaming = newPresence.activities.some(
            a => a.type === 4 && a.state === "Raimbow RP"
        );

        if (isStreaming) {
            if (!newPresence.member.roles.cache.has(config.Roles.streamer)) {
                await newPresence.member.roles.add(config.Roles.streamer);
                console.log(`✅  Rôle streamer ajouté à ${newPresence.member.displayName}`);            
            }
        } else {
            if (newPresence.member.roles.cache.has(config.Roles.streamer)) {
                await newPresence.member.roles.remove(config.Roles.streamer);
                console.log(`❌  Rôle streamer retirer à ${newPresence.member.displayName}`); 
            }
        }

    } catch (error) {
        console.error("Erreur presenceUpdate :", error);
    }
}