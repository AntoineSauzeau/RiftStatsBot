let lGameStarted = []

module.exports = {
    name: "spy",
    description: "...",
    run(client, message, args) {
        
        await client.db.pget("SELECT region, username_lol, currentGamePuuid FROM Users").then((rows) => {
            for ([region, usernameLol, currentGamePuuid] of rows){

                let summonerId
                await client.lolApi.get(region, 'summoner.getBySummonerName', usernameLol).then(data => {
                    summonerId = data.id
                });

                let currentGameData = await LolApiUtils.GetCurrentGameData(client.lolApi, summonerId, region)
                if(currentGameData != null){
                    message.channel.send(usernameLol + " has just launched a game !")
                }
                else{

                }
            }
        });
    },
};