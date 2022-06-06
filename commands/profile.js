const { MessageEmbed } = require('discord.js')
const LolApiUtils = require('../utils/LolApiUtils')
const LolStatsUtils = require('../utils/LolStatsUtils')
const EmojiDiscordIds = require('../emoji_discord_ids.json')

module.exports = {
    name: "profile",
    description: "...",
    async run(client, message, args) {

        const res = new MessageEmbed()
        
        let UsernameLol, region, summoner_id
        await client.db.pget("SELECT region, username_lol FROM Users WHERE user_discord_id=?", {
            1: message.author.id
        }
        ).then((row) => {
            UsernameLol = row.username_lol
            region = row.region
        }
        ).catch((err) => {
            console.log(err)
            return
        });

        console.log(UsernameLol)

        await client.lolApi.get(region, 'summoner.getBySummonerName', UsernameLol).then(data => {
            console.log(data)
            puuid = data.puuid
            summoner_id = data.id
        })

        let l_game_id
        const parent_region = LolApiUtils.getParentRegion(region)
        
        l_game_id = await LolApiUtils.GetAllPlayedMatchIdsLastMonth(client.lolApi, puuid, parent_region);
        
        let lGameData = await LolApiUtils.FetchGameDataFromList(client.lolApi, l_game_id, parent_region)
        
        const win_stats = LolStatsUtils.GetPlayerGlobalWinrate(UsernameLol, lGameData)
        const preferredRoles = LolStatsUtils.GetPlayerPreferredRoles(UsernameLol, lGameData)
        const averageCs = LolStatsUtils.GetPlayerAverageCsKilledPerMin(UsernameLol, lGameData)
        const averageKills = LolStatsUtils.GetPlayerAverageKillsPerMatch(UsernameLol, lGameData)
        const averageDeaths = LolStatsUtils.GetPlayerAverageDeathsPerMatch(UsernameLol, lGameData)
        const averageAssists = LolStatsUtils.GetPlayerAverageAssistsPerMatch(UsernameLol, lGameData)
        const mostPlayedChamps = await LolStatsUtils.GetPlayerMostPlayedChamps(UsernameLol, lGameData)

        const lRankModeData = await LolApiUtils.GetPlayerRankData(client.lolApi, summoner_id, region)

        console.log(preferredRoles)
        console.log(averageCs)

        res.setTitle(UsernameLol + "'s profile")
        .addField("Games played (last 30 days) :", (win_stats.n_lose+win_stats.n_win).toString(), true)
        .addField("Winrate :", win_stats.winrate + "% ("+win_stats.n_win+"W, "+win_stats.n_lose+"L)", true)
        .addField("Roles :", "1: " + preferredRoles[0][0] + " (" + Math.round((preferredRoles[0][1]/l_game_id.length)*100) + "%), " + "2: " + preferredRoles[1][0] + " (" + Math.round((preferredRoles[1][1]/l_game_id.length)*100) + "%)")
        .addField("Average cs ", ""+averageCs+" cs/min")
        .addField("Average KDA :", averageKills+"/"+averageDeaths+"/"+averageAssists)

        for(const rankModeApiName in lRankModeData){

            let rankModeName
            if(rankModeApiName == "RANKED_FLEX_SR"){
                rankModeName = "Ranked Flex"
            }
            else if(rankModeApiName == "RANKED_SOLO_5x5"){
                rankModeName = "Ranked Solo/Duo"
            }

            if(lRankModeData[rankModeApiName] == null){
                res.addField(rankModeName, "Unranked")
                continue
            }

            let rankModeData = lRankModeData[rankModeApiName]
            let winrate = Math.round((rankModeData.wins / (rankModeData.wins + rankModeData.losses)) * 100)

            let tierDisplayName = rankModeData.tier.toLowerCase()
            tierDisplayName = tierDisplayName[0].toUpperCase() + tierDisplayName.slice(1)

            tierEmojiId = EmojiDiscordIds["Emblem_"+tierDisplayName+"_lol"]

            res.addField(rankModeName, tierEmojiId + " " + tierDisplayName + " " + rankModeData.rank + ", " + rankModeData.leaguePoints + "LP | " + winrate + "% (" + rankModeData.wins + "W " + rankModeData.losses + "L)")
        }

        let preferredChampsFieldValue = ""
        for(let i = 0; i < 3; i++){
            const champName = mostPlayedChamps[i][0]
            const nTimePlayed =  mostPlayedChamps[i][1]

            const playerChampWinData = LolStatsUtils.GetPlayerWinDataWithSpecificChamp(UsernameLol, lGameData, champName)
            const playerChampKdaData = LolStatsUtils.GetPlayerKdaDataWithSpecificChamp(UsernameLol, lGameData, champName)
            preferredChampsFieldValue += "\n" + playerChampWinData.winrate + "% (" + playerChampWinData.nWin + "W " + playerChampWinData.nLose + "L) " + playerChampKdaData.kda + "KDA"
        }

        res.addField("Preferred champions :", preferredChampsFieldValue)

        res.setColor('#16a085')

        message.channel.send({ embeds: [res] });

    },
};



