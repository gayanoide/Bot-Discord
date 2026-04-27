const chalk = require('chalk')
const fs = require('fs');
var AsciiTable = require('ascii-table')
var table = new AsciiTable()
table.setHeading('Commandes', 'Stats').setBorder('|', '=', "0", "0")

module.exports = client => {
fs.readdirSync('./Commandes/').forEach(dir => {
const files = fs.readdirSync(`./Commandes/`).filter(file => file.endsWith('.js'));
if(!files || files.length <= 0) console.log(chalk.red("Commandes - 0"))
files.forEach((file) => {
 let command = require(`../Commandes/${file}`)
                if(command) {
                  client.commands.set(command.name, command)
                   if(command.aliases && Array.isArray(command.aliases)) {
                        command.aliases.forEach(alias => {
                           client.aliases.set(alias, command.name)
                           })
                         }
                        table.addRow(command.name, ' ✅')
                        } else {
                                table.addRow(file, '⛔')
                        }
                });
});
  //console.log(chalk.blue(table.toString()))
};