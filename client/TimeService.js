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

function SetTime(start, houre) {
    var date = new Date()
    date = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear()
    var time = new Date(date + " " + start + ':00:00');
    time = new Date(time.getTime() + houre * 3600 * 1000);
    return moment(time).format("HH:mm");
}

module.exports.FormatTime = FormatTime;
module.exports.SetTime = SetTime;