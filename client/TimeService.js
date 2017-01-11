var moment = require('moment')

function FormatTime(time) {
    var res = time.split(":")
    var m = moment();
    var minute = res[1] ? res[1] : 0
    m.set({
        hour: res[0],
        minute: minute,
        second: 0,
        millisecond: 0
    })
    return m.format()
}

function CheckDroneStatus(time, houre) {
    console.log("======================", time, houre)
    var now = moment().hours()
    var start = parseInt(time);
    var end = start + parseInt(houre) - 24;
    console.log({
        "start": start,
        "end": end,
        "now": now
    })
    if (now < end && now && start) {
        return true
    } else if (now > start && now > end) {
        return true
    } else {
        return false
    }
}

function SetTime(start, houre) {
    var date = new Date()
    date = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear()
    var time = new Date(date + " " + start + ':00:00');
    time = new Date(time.getTime() + houre * 3600 * 1000);
    return moment(time).format("HH:mm");
}

module.exports.FormatTime = FormatTime;
module.exports.SetTime = SetTime;
module.exports.CheckDroneStatus = CheckDroneStatus;