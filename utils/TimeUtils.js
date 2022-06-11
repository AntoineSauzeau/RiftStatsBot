


module.exports.GetFormattedElapsedTimeFromSeconds = (nSecond) => {

    let nHour = 0
    let nMinute = 0

    console.log(nSecond, nMinute, nHour)
    nMinute = ~~(nSecond/60)
    console.log(nSecond, nMinute, nHour)
    nSecond -= nMinute * 60
    console.log(nSecond, nMinute, nHour)
    nHour = ~~(nMinute/60)
    console.log(nSecond, nMinute, nHour)
    nMinute -= nHour * 60
    console.log(nSecond, nMinute, nHour)

    formattedElapsedTime = ""
    if(nHour >= 10){
        formattedElapsedTime += nHour
    }
    else{
        formattedElapsedTime += "0" + nHour
    }

    formattedElapsedTime += "h"

    if(nMinute >= 10) {
        formattedElapsedTime += nMinute
    }
    else{
        formattedElapsedTime += "0" + nMinute
    }

    formattedElapsedTime += "m"

    if(nSecond >= 10) {
        formattedElapsedTime += nSecond
    }
    else{
        formattedElapsedTime += "0" + nSecond
    }

    formattedElapsedTime += "s"

    return formattedElapsedTime
}