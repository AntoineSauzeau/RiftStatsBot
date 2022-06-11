const LolApiUtils = require('./LolApiUtils')
const Fetch = require('node-fetch')
const TimeUtils = require('./TimeUtils')

module.exports.GetPlayerDataFromGameData = (PlayerName, participantsData) => {

    for (PlayerData of participantsData){
        if(PlayerData.summonerName == PlayerName){
            return PlayerData
        }
    }
}

module.exports.GetPlayerGlobalWinrate = (playerName, lGameData) => {

    let n_win = 0, n_lose = 0
    for(const gameData of lGameData) {
    
        if(module.exports.GetPlayerDataFromGameData(playerName, gameData.info.participants).win){
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
        const playerData = module.exports.GetPlayerDataFromGameData(playerName, gameData.info.participants)
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

        const playerData = module.exports.GetPlayerDataFromGameData(playerName, gameData.info.participants)
        csKilled += playerData.totalMinionsKilled
        console.log(playerData.totalMinionsKilled)
        timePlayed += gameData.info.gameDuration
    }

    return Math.round((csKilled / (timePlayed / 60)) * 10) / 10
}

module.exports.GetPlayerAverageDeathsPerMatch = (playerName, lGameData) => {

    let nDeath = 0

    for(const gameData of lGameData) {
        const playerData = module.exports.GetPlayerDataFromGameData(playerName, gameData.info.participants)
        nDeath += playerData.deaths
    }

    return Math.round((nDeath / lGameData.length) * 10) / 10
}

module.exports.GetPlayerAverageKillsPerMatch = (playerName, lGameData) => {

    let nKill = 0

    for(const gameData of lGameData) {
        const playerData = module.exports.GetPlayerDataFromGameData(playerName, gameData.info.participants)
        nKill += playerData.kills
    }

    return Math.round((nKill / lGameData.length) * 10) / 10
}

module.exports.GetPlayerAverageAssistsPerMatch = (playerName, lGameData) => {
    
    let nAssist = 0

    for(const gameData of lGameData) {
        const playerData = module.exports.GetPlayerDataFromGameData(playerName, gameData.info.participants)
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

    for (let champ in champsData) {
        lChamp[champ] = 0
    }

    for(const gameData of lGameData) {
        const playerData = module.exports.GetPlayerDataFromGameData(playerName, gameData.info.participants)
        lChamp[playerData.championName] += 1
    }

    let lChampSorted = []
    for(const [champName, nTimePlayed] of Object.entries(lChamp)){
        lChampSorted.push([champName, nTimePlayed])
    }

    for(let index = 1; index < lChampSorted.length; index += 1){
        let currentItem = lChampSorted[index].slice()
        let currentLeftIndex = index-1

        while(currentLeftIndex >= 0 && lChampSorted[currentLeftIndex][1] < currentItem[1]){
            lChampSorted[currentLeftIndex+1][0] = lChampSorted[currentLeftIndex][0]
            lChampSorted[currentLeftIndex+1][1] = lChampSorted[currentLeftIndex][1]
            currentLeftIndex -= 1
        }

        lChampSorted[currentLeftIndex+1][0] = currentItem[0]
        lChampSorted[currentLeftIndex+1][1] = currentItem[1]
    }

    console.log(lChampSorted)
    return lChampSorted

}

module.exports.GetPlayerWinDataWithSpecificChamp = (playerName, lGameData, championName) => {

    champWinData = {
        nWin: 0,
        nLose: 0,
        winrate: 0
    }

    for(const gameData of lGameData) {
        const playerData = module.exports.GetPlayerDataFromGameData(playerName, gameData.info.participants)
        if(playerData.championName == championName){
            if(playerData.win){
                champWinData.nWin += 1
            }
            else {
                champWinData.nLose += 1
            }
        }
    }

    champWinData.winrate = Math.round((champWinData.nWin / (champWinData.nWin + champWinData.nLose))*100)

    return champWinData
}

module.exports.GetPlayerKdaDataWithSpecificChamp = (playerName, lGameData, championName) => {

    let nTotalKill = 0
    let nTotalDeath = 0
    let nTotalAssist = 0

    champKdaData = {
        kda: 0,
        nKill: 0,
        nDeath: 0,
        nAssist: 0
    }

    for(const gameData of lGameData) {
        const playerData = module.exports.GetPlayerDataFromGameData(playerName, gameData.info.participants)
        if(playerData.championName == championName){
            nTotalKill += playerData.kills
            nTotalDeath += playerData.deaths
            nTotalAssist += playerData.assists
        }
    }

    champKdaData.nKill = Math.round((nTotalKill / lGameData.length) * 10) / 10
    champKdaData.nDeath = Math.round((nTotalDeath / lGameData.length) * 10) / 10
    champKdaData.nAssist = Math.round((nTotalAssist / lGameData.length) * 10) / 10
    champKdaData.kda = Math.round(((champKdaData.nKill + champKdaData.nAssist) / champKdaData.nDeath) * 100) / 100

    return champKdaData
}

module.exports.GetTimePlayed = (lGameData) => {

    let timePlayedInSeconds = 0

    for(const gameData of lGameData) {
        timePlayedInSeconds += gameData.info.gameDuration
    }

    return TimeUtils.GetFormattedElapsedTimeFromSeconds(timePlayedInSeconds)
}


//https://emoji.gg/emoji/8176-wr-jungle