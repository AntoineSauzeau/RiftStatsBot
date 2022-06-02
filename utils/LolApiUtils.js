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

    l_game_data = []
    l_game_id.forEach((game_id) => {

        lolApi.pget(parent_region, 'match.getMatch', game_id).then(data => {
            l_game__data.append(data)
            console.log(data)
        })
    });

    return l_game_data
}