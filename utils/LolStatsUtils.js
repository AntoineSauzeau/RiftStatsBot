const LolApiUtils = require('./LolApiUtils')
const Fetch = require('node-fetch')

module.exports.GetPlayerGlobalWinrate = (playerName, lGameData) => {

    let n_win = 0, n_lose = 0
    for(const gameData of lGameData) {
    
        if(LolApiUtils.GetPlayerDataFromGameData(playerName, gameData).win){
            n_win++
        }
        else{
            n_lose++
        }
    }

    return {
        "winrate": Math.round((n_win / (n_win + n_lose))*100),
        "n_win": n_win,
        "n_lose": n_lose
    }

}

module.exports.GetPlayerPreferredRoles = (playerName, lGameData) => {

    let lRoleFrequency = [['top', 0], ['jungle', 0], ['mid', 0], ['adc', 0], ['support', 0]]

    for(const gameData of lGameData) {
        const playerData = LolApiUtils.GetPlayerDataFromGameData(playerName, gameData)
        if(playerData.role == 'SOLO' && playerData.lane == 'TOP'){
            lRoleFrequency[0][1] += 1
        }
        else if(playerData.role == 'NONE' && playerData.lane == 'JUNGLE'){
            lRoleFrequency[1][1] += 1
        }
        else if(playerData.role == 'SOLO' && playerData.lane == 'MID'){
            lRoleFrequency[2][1] += 1
        }
        else if(playerData.role == 'CARRY' && playerData.lane == 'BOTTOM') {
            lRoleFrequency[3][1] += 1
        }
        else if(playerData.role == 'SUPPORT' && playerData.lane == 'BOTTOM'){
            lRoleFrequency[4][1] += 1 
        }
    }

    console.log(lRoleFrequency)

    for(let index = 1; index < lRoleFrequency.length; index += 1){
        let currentItem = lRoleFrequency[index].slice()
        let currentLeftIndex = index-1

        while(currentLeftIndex >= 0 && lRoleFrequency[currentLeftIndex][1] < currentItem[1]){
            lRoleFrequency[currentLeftIndex+1][0] = lRoleFrequency[currentLeftIndex][0]
            lRoleFrequency[currentLeftIndex+1][1] = lRoleFrequency[currentLeftIndex][1]
            currentLeftIndex -= 1
        }

        lRoleFrequency[currentLeftIndex+1][0] = currentItem[0]
        lRoleFrequency[currentLeftIndex+1][1] = currentItem[1]
    }

    return lRoleFrequency
}

module.exports.GetPlayerAverageCsKilledPerMin = (playerName, lGameData) => {

    let csKilled = 0
    let timePlayed = 0  //In seconds

    for(const gameData of lGameData) {

        const playerData = LolApiUtils.GetPlayerDataFromGameData(playerName, gameData)
        csKilled += playerData.totalMinionsKilled
        timePlayed += gameData.info.gameDuration
    }

    return Math.round((csKilled / (timePlayed / 60)) * 10) / 10
}

module.exports.GetPlayerAverageDeathsPerMatch = (playerName, lGameData) => {

    let nDeath = 0

    for(const gameData of lGameData) {
        const playerData = LolApiUtils.GetPlayerDataFromGameData(playerName, gameData)
        nDeath += playerData.deaths
    }

    return Math.round((nDeath / lGameData.length) * 10) / 10
}

module.exports.GetPlayerAverageKillsPerMatch = (playerName, lGameData) => {

    let nKill = 0

    for(const gameData of lGameData) {
        const playerData = LolApiUtils.GetPlayerDataFromGameData(playerName, gameData)
        nKill += playerData.kills
    }

    return Math.round((nKill / lGameData.length) * 10) / 10
}

module.exports.GetPlayerAverageAssistsPerMatch = (playerName, lGameData) => {
    
    let nAssist = 0

    for(const gameData of lGameData) {
        const playerData = LolApiUtils.GetPlayerDataFromGameData(playerName, gameData)
        nAssist += playerData.assists
    }

    return Math.round((nAssist / lGameData.length) * 10) / 10
}

module.exports.GetPlayerMostPlayedChamps = async (playerName, lGameData) => {

    let lChamp = {}

    let settings = {method: "GET"}
    let urlChampsData = "http://ddragon.leagueoflegends.com/cdn/12.10.1/data/en_US/champion.json"

    let champsData
    await fetch(urlChampsData, settings)
    .then(res => res.json())
    .then((json) => {
        champsData = json.data
    });

    for (champ in champsData) {
        lChamp[champsData[champ].name] = 0
    }

    for(const gameData of lGameData) {
        const playerData = LolApiUtils.GetPlayerDataFromGameData(playerName, gameData)
        lChamp[playerData.championName] += 1
    }

    console.log(lChamp)
    return lChamp

}
//https://emoji.gg/emoji/8176-wr-jungle