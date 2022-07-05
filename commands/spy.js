let lGameStarted = []

module.exports = {
    name: "spy",
    description: "...",
    run(client, message, args) {
        
        await client.db.pget("SELECT activated, channelId FROM SpyMod WHERE guilId=:guildId", {
            guildId: message.guild.id
        }).then((row) => {

            if(row == undefined) {
                await client.db.prun("INSERT INTO SpyMod (guildId, activated, channelId) VALUES (guildId=:guildId, activated=:activated, channelId=:channelId", {
                    guildId: message.guild.id,
                    activated: true,
                    channelId: message.channel.id
                });
            }
            else{
                await client.prun("UPDATE SpyMod SET activated=True AND channelId=:channelId", {
                    channelId: message.channel.id
                }).catch(err => {
                    console.log(err)
                });
            }

        }).catch(err => {
            console.log(err)
        });

    },
};

module.exports.startSpyLoop = async (client) => {

    while(true) {

        await client.db.pall("SELECT region, username_lol, currentGameId FROM Users").then((rows) => {
            for ([region, usernameLol, currentGameId] of rows){

                let summonerId
                await client.lolApi.get(region, 'summoner.getBySummonerName', usernameLol).then(data => {
                    summonerId = data.id
                });

                let currentGameData = await LolApiUtils.GetCurrentGameData(client.lolApi, summonerId, region)
                if(currentGameData != null && currentGameId != currentGameData.info.gameId){
                    //message.channel.send(usernameLol + " has just launched a game !") Voir pour récupérer le channel
                    currentGameId = currentGameData.info.gameId
                }
                
                await client.db.prun("UPDATE Users SET currentGameId=:currentGameId WHERE username_lol=:usernameLol", {
                    currentGameId: currentGameId,
                    usernameLol: usernameLol
                }).catch(err => {
                    console.log(err)
                })
            }
        });

        await new Promise(resolve => setTimeout(resolve, 128000));
    }
}