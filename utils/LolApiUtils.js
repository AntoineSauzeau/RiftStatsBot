const Fetch = require('node-fetch')

const l_region = ['br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'tr1', 'ru']

module.exports.getValidRegionName = (region) => {

    region = region.toLowerCase()
    console.log(region[region.length - 1])
    if(region[region.length - 1] != '1' && !region[region.length - 1] != '2'){
        region += '1'
    }

    if(l_region.indexOf(region) != -1){
        return region
    }
    else{
        return -1
    }
}

module.exports.getParentRegion = (region) => {

    region = region.toLowerCase()

    if(region == 'la1' || region == 'la2' || region == 'br1' || region == 'na1' || region == 'oc1' ) {
        return 'americas'
    }
    else if(region == 'eun1' || region == 'euw1' || region == 'ru' || region == 'tr1') {
        return 'europe'
    }
    else if(region == 'jp1' || region == 'kr'){
        return 'asia'
    }

}

module.exports.FetchGameDataFromList = async (lolApi, l_game_id, parent_region) => {

    let l_game_data = []
    for (let game_id of l_game_id){
        await lolApi.get(parent_region, 'match.getMatch', game_id).then(data => {
            l_game_data.push(data)
        })
    };

    return l_game_data
}

module.exports.GetAllPlayedMatchIdsLastMonth = async (lolApi, puuid, region) => {

    let index = 0
    let l_game_ids = []

    let n_match_found = 0
    do {
        n_match_found = 0
        await lolApi.get(region, 'match.getMatchIdsByPUUID', puuid, {
            startTime: Math.floor(Date.now()/1000)-30*24*60*60,
            endTime: Math.floor(Date.now()/1000),
            count: 100,
            start: index
        }).then(data => {
            l_game_ids = l_game_ids.concat(data)
            n_match_found = data.length
        })

        index += n_match_found

    } while(n_match_found == 100);

    console.log(l_game_ids)

    return l_game_ids
}

module.exports.GetPlayerRankData = async (lolApi, summoner_id, region) => {

    lRankData = {"RANKED_FLEX_SR": null, "RANKED_SOLO_5x5": null}

    await lolApi.get(region, 'league.getLeagueEntriesForSummoner', summoner_id).then(data => {
        for(rankModeData of data){
            lRankData[rankModeData.queueType] = rankModeData
        }
    })

    console.log(lRankData)

    return lRankData
}

module.exports.GetCurrentGameData = async (lolApi, summonerId, region) => {

    console.log(region + summonerId)

    await lolApi.get(region, 'spectator.getCurrentGameInfoBySummoner', summonerId).then(data => {
        console.log(data)
        return data
    }).catch(err => {
        console.log(err)
    })
}

module.exports.GetChampionNameFromId = async (id) => {

    let urlChampsData = "http://ddragon.leagueoflegends.com/cdn/12.10.1/data/en_US/champion.json"
    let settings = {method: "GET"}

    await fetch(urlChampsData, settings)
    .then(res => res.json())
    .then((json) => {

        console.log(json)

        let champsData = json.data

        for (let i in champsData){

            if(champsData[i].key == id){
                return champsData[i].name
            }
        }
    });
}
