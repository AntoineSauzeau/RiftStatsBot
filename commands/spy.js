

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
                }).then(() => {
                    message.channel.send("Le mode espion a bien été activé dans ce channel !")
                }).catch(err => {
                    console.log(err)
                });
            }
            else{
                if(row.activated == 1){
                    await client.db.prun("UPDATE SpyStatusPerGuild SET activated=0 AND channelId=$channelId", {
                        $channelId: message.channel.id
                    }).then(() => {
                        message.channel.send("Le mode espion a été désactivé dans ce channel")
                    }).catch(err => {
                        console.log(err)
                    });
                }
                else if(row.activated == 0){
                    await client.db.prun("UPDATE SpyStatusPerGuild SET activated=1 AND channelId=$channelId", {
                        $channelId: message.channel.id
                    }).then(() => {
                        message.channel.send("Le mode espion a bien été activé dans ce channel !")
                    }).catch(err => {
                        console.log(err)
                    });
                }
            }

        }).catch(err => {
            console.log(err)
        });

    },
};
