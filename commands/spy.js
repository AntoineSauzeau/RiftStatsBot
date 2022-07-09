

module.exports = {
    name: "spy",
    description: "...",
    async run(client, message, args) {
        
        await client.db.pget("SELECT activated, channelId FROM SpyStatusPerGuild WHERE guildId=$guildId", {
            $guildId: message.guild.id
        }).then(async (row) => {

            if(row == undefined) {
                await client.db.prun("INSERT INTO SpyStatusPerGuild (guildId, activated, channelId) VALUES ($guildId, $activated, $channelId)", {
                    $guildId: message.guild.id,
                    $activated: true,
                    $channelId: message.channel.id
                }).catch(err => {
                    console.log(err)
                });
            }
            else{
                await client.prun("UPDATE SpyStatusPerGuild SET activated=1 AND channelId=$channelId", {
                    $channelId: message.channel.id
                }).catch(err => {
                    console.log(err)
                });
            }

        }).catch(err => {
            console.log(err)
        });

    },
};
