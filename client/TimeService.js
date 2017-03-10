var moment = require('moment')

function CheckDates(time, houre) {
    var dayTime = (60*24*1000) * 60;

    var toDayTime = moment(new Date()).hours(0).minutes(0).valueOf();

    var allTime = time.split(":");

    var startTime = moment().hours(allTime[0]).minutes(allTime[1]).valueOf() - toDayTime;

    var endTime = startTime + (houre * 60 * 60 * 1000);

    var currentTime = moment(new Date()).valueOf() - toDayTime;

    return (endTime - dayTime > 0 && endTime - dayTime > currentTime) || (startTime <= currentTime && endTime > currentTime)
}

module.exports.CheckDates = CheckDates;