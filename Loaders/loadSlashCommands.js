const { REST, Routes, SlashCommandBuilder } = require("discord.js");

module.exports = async client => {

    let commands = [];

    for (const command of client.commands.values()) {

        let slashCommand = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDMPermission(command.dm)
            .setDefaultMemberPermissions(command.permission === "Aucune" ? null : command.permission);

        if (command.options?.length >= 1) {
            for (let i = 0; i < command.options.length; i++) {
                const type = command.options[i].type;
                const methodName = `add${type.slice(0, 1).toUpperCase() + type.slice(1)}Option`;

                if (type === "string") {
                    slashCommand[methodName](opt =>
                        opt.setName(command.options[i].name)
                           .setDescription(command.options[i].description)
                           .setAutocomplete(command.options[i].autocomplete)
                           .setRequired(command.options[i].required)
                    );
                } else {
                    slashCommand[methodName](opt =>
                        opt.setName(command.options[i].name)
                           .setDescription(command.options[i].description)
                           .setRequired(command.options[i].required)
                    );
                }
            }
        }

        commands.push(slashCommand);
    }

    const rest = new REST({ version: "10" }).setToken(client.token);
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });

    console.log(`==        ✅   ${commands.length} slash commande(s) chargée(s)       ==`);    
    console.log("==                                                 ==");
};