


module.exports.GetLongFormattedElapsedTimeFromSeconds = (nSecond) => {

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

module.exports.GetShortFormattedElapsedTimeFromSeconds = (nSecond) => {

    let nSeconds = 0, nMinute = 0, nHour = 0, nDay = 0, nMonth = 0, nYear = 0

    nMinute = ~~(nSecond/60)
    nHour = ~~(nMinute/60)
    nDay = ~~(nHour/24)
    nMonth = ~~(nDay/30)
    nYear = ~~(nMonth/12)

    console.log(nSecond, nMinute, nHour, nDay, nMonth, nYear)

    let returnValue = ""

    if(nMinute == 0){
        returnValue = nSeconds + " second"
    }
    else if(nHour == 0){
        returnValue = nMinute + " minute"
    }
    else if(nDay == 0){
        returnValue = nHour + " hour"
    }
    else if(nMonth == 0){
        returnValue = nDay + " day"
    }
    else if(nYear == 0){
        returnValue = nMonth + " month"
    }
    else{
        returnValue = nYear + " year"
    }

    if(returnValue[0] != "1" || returnValue[1] != " "){
        returnValue += "s"
    }

    return returnValue

}