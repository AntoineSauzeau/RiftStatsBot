const { MessageEmbed } = require('discord.js')

const N_COMMANDS_PER_PAGE = 8

module.exports = {
    name: "commands",
    description: "...",
    run(client, message, args) {
        
        const res = new MessageEmbed()
        .setTitle("Commands")
        .setColor('#16a085')

        let page = 0
        let cmd_index = 0

        for(const [cmd_name, cmd] of client.commands){

            if(cmd_index < page * N_COMMANDS_PER_PAGE){
                cmd_index++
                continue
            }

            res.addField(cmd_name, cmd.description)

            cmd_index++
            if(cmd_index == client.commands.size){
                break
            }
        }

        message.channel.send({ embeds: [res] });
    },
};