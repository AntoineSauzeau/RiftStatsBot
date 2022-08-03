const LolApiUtils = require('../utils/LolApiUtils')

module.exports.startSpyLoop = async (client) => {

    while(true) {

        await client.db.pall("SELECT user_discord_id, region, username_lol, currentGameId FROM Users").then(async (rows) => {

            console.log(rows)

            for (row of rows){

                const userDiscordId = row.user_discord_id
                const region = row.region
                const usernameLol = row.username_lol
                let currentGameId = row.currentGameId

                let summonerId
                await client.lolApi.get(region, 'summoner.getBySummonerName', usernameLol).then(data => {
                    console.log(usernameLol)
                    if(!data){
                        summonerId == undefined 
                    }
                    else{
                        summonerId = data.id
                    }
                }).catch(err => {
                    console.log(err)
                });

                if(!summonerId){
                    continue
                }

                let currentGameData = await LolApiUtils.GetCurrentGameData(client.lolApi, summonerId, region)
                if(currentGameData != undefined && currentGameId != currentGameData.gameId){

                    console.log("1")
                    console.log(client.users.cache.get(userDiscordId))
                    client.users.cache.get(userDiscordId).then(user => {
                        console.log("2")
                        client.guilds.resolve(user.guild.id).then(async guild => {
                            console.log("3")

                            /*console.log(guild.id)
                            console.log(user.id)*/

                            //We see if the spy mode is activated for this guild and if yes we get channel
                            await client.db.pget("SELECT channelId FROM SpyStatusPerGuild WHERE guildId=$guildId", {
                                $guildId: guild.id
                            }).then(row => {

                                if(row != null){
                                    guild.channels.fetch(row.channelId).then(channel => {
                                        channel.send(usernameLol + " has just launched a game !")
                                    })
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        });
                    });

                    currentGameId = currentGameData.gameId
                }
                
                await client.db.prun("UPDATE Users SET currentGameId=$currentGameId WHERE username_lol=$usernameLol", {
                    $currentGameId: currentGameId,
                    $usernameLol: usernameLol
                }).catch(err => {
                    console.log(err)
                })
            }
        });

        await new Promise(resolve => setTimeout(resolve, 128000));
    }
}