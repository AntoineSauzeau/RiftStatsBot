


module.exports.SetResponseEmbedDefaultValues = (message, embed) => {

    embed.setTimestamp()
    embed.setFooter("RiftStats 0.1 | Requested by " + message.author.username)
    embed.setColor('#16a085')
}

