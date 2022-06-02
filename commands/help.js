const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "help",
    description: "...",
    run(client, message, args) {
        
        const res = new MessageEmbed()
            .setTitle("Help")
            .addField('Commands', 'Check the availables commandes with /commands')
            .addField('Invite', 'You can invite this bot with this link or /invite')
            .addField('Ticket', 'Still need a little help? Use /ticket')
            .addField('Github', 'To contribute or just see the code, use /github')
            .addField('Top.gg', "To support you can vote for this bot with /vote")
            .setColor('#16a085')

        message.channel.send({ embeds: [res] });
    },
};