var moment = require('moment')

function CheckDates(time, houre) {
    var dayTime = (60*24*1000) * 60;

    var currentDate = new Date();


    var timeFromDay = (new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())).setHours(0).setMinutes(0).setSeconds(0).getTime();

    var allTime = time.split(":");

    var startTime = (new Date()).setHours(allTime[0]).setMinutes(allTime[1]).getTime() - timeFromDay;

    var endTime = startTime + (houre * 60 * 60 * 1000);

    var currentTime = currentDate.getTime() - timeFromDay;

    return (endTime - dayTime > 0 && endTime - dayTime > currentTime) || (startTime < currentTime && endTime > currentTime)
}

module.exports.CheckDates = CheckDates;