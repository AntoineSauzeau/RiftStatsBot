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