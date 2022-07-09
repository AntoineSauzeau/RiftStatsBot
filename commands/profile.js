const { MessageEmbed } = require('discord.js')
const LolApiUtils = require('../utils/LolApiUtils')
const LolStatsUtils = require('../utils/LolStatsUtils')
const EmojiDiscordIds = require('../emojiDiscordIds.json')
const TimeUtils = require('../utils/TimeUtils')
const CommandsUtils = require('../utils/CommandsUtils')

module.exports = {
    name: "profile",
    description: "...",
    async run(client, message, args) {

        const res = new MessageEmbed()

        let UsernameLol, region
        if(args.length >= 2){
            region = args[2]
            UsernameLol = args.slice(2).join()
        }
        else{
            await client.db.pget("SELECT region, username_lol FROM Users WHERE user_discord_id=?", {
                1: message.author.id
            }
            ).then((row) => {

                if(row == undefined){
                    message.channel.send("You didn't specify an lol account. Do it !link")
                }

                UsernameLol = row.username_lol
                region = row.region
            }
            ).catch((err) => {
                console.log(err)
                return
            });
        }

        console.log(UsernameLol)

        let summonerId, profileIconId, puuid, summonerLevel
        await client.lolApi.get(region, 'summoner.getBySummonerName', UsernameLol).then(data => {
            console.log(data)
            puuid = data.puuid
            summonerId = data.id
            profileIconId = data.profileIconId
            summonerLevel = data.summonerLevel
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

        const lRankModeData = await LolApiUtils.GetPlayerRankData(client.lolApi, summonerId, region)

        console.log(preferredRoles)
        console.log(averageCs)

        res.setTitle(UsernameLol + "'s profile")

        res.addField("Region", region.toUpperCase(), true)
        res.addField("Level", summonerLevel + "", true)
        res.addField("\u200B", "\u200B", true)

        let playedTime = LolStatsUtils.GetTimePlayed(lGameData)
        res.addField("Games played (last 30 days) :", (win_stats.n_lose+win_stats.n_win).toString() + " (" + playedTime + ")", true)

        .addField("Winrate :", win_stats.winrate + "% ("+win_stats.n_win+"W, "+win_stats.n_lose+"L)", true)

        console.log(LolStatsUtils.GetTimePlayed(lGameData))

        let roleFieldValue = ""
        for(let i = 0; i < 3; i++){
            roleFieldValue += EmojiDiscordIds["Roles"]["position_" + preferredRoles[i][0] + "_lol"] + " " + (i+1) + ") " + preferredRoles[i][0] + " (" + Math.round((preferredRoles[i][1]/l_game_id.length)*100) + "%)\n"
        }
        res.addField("Roles :", roleFieldValue)
        
        .addField("Average KDA :", averageKills+"/"+averageDeaths+"/"+averageAssists, true)
        .addField("Average cs :", ""+averageCs+" cs/min", true)

        for(const rankModeApiName in lRankModeData){

            let rankModeName
            if(rankModeApiName == "RANKED_FLEX_SR"){
                rankModeName = "Ranked Flex :"
            }
            else if(rankModeApiName == "RANKED_SOLO_5x5"){
                rankModeName = "Ranked Solo/Duo :"
            }

            if(lRankModeData[rankModeApiName] == null){
                res.addField(rankModeName, "Unranked")
                continue
            }

            let rankModeData = lRankModeData[rankModeApiName]
            let winrate = Math.round((rankModeData.wins / (rankModeData.wins + rankModeData.losses)) * 100)

            let tierDisplayName = rankModeData.tier.toLowerCase()
            tierDisplayName = tierDisplayName[0].toUpperCase() + tierDisplayName.slice(1)

            tierEmojiId = EmojiDiscordIds["Emblems"]["Emblem_"+tierDisplayName+"_lol"]

            res.addField(rankModeName, tierEmojiId + " " + tierDisplayName + " " + rankModeData.rank + ", " + rankModeData.leaguePoints + "LP | " + winrate + "% (" + rankModeData.wins + "W " + rankModeData.losses + "L)")
        }

        let preferredChampsFieldValue = ""
        for(let i = 0; i < 3; i++){
            const champName = mostPlayedChamps[i][0]
            const nTimePlayed =  mostPlayedChamps[i][1]

            const playerChampWinData = LolStatsUtils.GetPlayerWinDataWithSpecificChamp(UsernameLol, lGameData, champName)
            const playerChampKdaData = LolStatsUtils.GetPlayerKdaDataWithSpecificChamp(UsernameLol, lGameData, champName)
            preferredChampsFieldValue += "\n" + EmojiDiscordIds["Champions"]["champ_"+champName+"_lol"] + " " + (i+1) + ") " + champName + ": " + playerChampWinData.winrate + "% (" + playerChampWinData.nWin + "W " + playerChampWinData.nLose + "L) " + playerChampKdaData.kda + " KDA"
        }

        res.addField("Preferred champions :", preferredChampsFieldValue)


        /* Current game field */
        let currentGameFieldValue = ""
        let currentGameData = await LolApiUtils.GetCurrentGameData(client.lolApi, summonerId, region)
        if(currentGameData == null){
            currentGameFieldValue = "Currently not playing"
        }
        else{
            let playerData = LolStatsUtils.GetPlayerDataFromGameData(UsernameLol, currentGameData.participants)
            let gameMode = currentGameData.gameMode[0] + currentGameData.gameMode.toLowerCase().slice(1).toLowerCase()
            let champName = await LolApiUtils.GetChampionNameFromId(playerData.championId)
            currentGameFieldValue = gameMode + " with " + EmojiDiscordIds["Champions"]["champ_"+champName+"_lol"] + " "  + champName + " | *for " + TimeUtils.GetShortFormattedElapsedTimeFromSeconds(currentGameData.gameLength) + "*"	
        }

        res.addField("Game in progress :", currentGameFieldValue)


        /* Last game field */
        let lastGameFieldValue = ""

        lastGameModePlayed = lGameData[0].info.gameMode.toLowerCase()
        lastGameModePlayed = lastGameModePlayed[0].toUpperCase() + lastGameModePlayed.slice(1)

        let timeElapsedFromGame = "*" + TimeUtils.GetShortFormattedElapsedTimeFromSeconds((Date.now() - lGameData[0].info.gameEndTimestamp) / 1000) + "*"

        let playerData = LolStatsUtils.GetPlayerDataFromGameData(UsernameLol, lGameData[0].info.participants)

        if(playerData.win){
            lastGameFieldValue += ":green_circle: "
        } else{
            lastGameFieldValue += ":red_circle: "
        }   
        lastGameFieldValue += lastGameModePlayed + " as " + EmojiDiscordIds["Champions"]["champ_"+playerData.championName+"_lol"] + " " + playerData.championName + " with " + playerData.kills + "/" + playerData.deaths + "/" + playerData.assists + " and " + (playerData.totalMinionsKilled+playerData.neutralMinionsKilled) + " CS | " + timeElapsedFromGame + " ago"
        res.addField("Last game :", lastGameFieldValue)

        res.setThumbnail("http://ddragon.leagueoflegends.com/cdn/12.10.1/img/profileicon/"+profileIconId+".png")
        res.setColor('#16a085')

        CommandsUtils.SetResponseEmbedDefaultValues(message, res)

        message.channel.send({ embeds: [res] });

    },
};



