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
    var getTimeHoureMinute = function(t) {
        return {
            houre: moment(moment().format('M-D-YY') + ' ' + t + ':00:00').hours(),
            minute: moment(moment().format('M-D-YY') + ' ' + t + ':00:00').minutes()
        }
    }

    var setTimeHoureMinute = function(h, m) {
        return moment().hours(h).minute(m).format('HH:mm')
    }

    var now = getTimeHoureMinute(moment().format('HH:mm'));
    var start = getTimeHoureMinute(time);
    var end = parseInt(start.houre) + parseInt(houre) - 24;

    now = setTimeHoureMinute(now.houre, now.minute);
    end = setTimeHoureMinute(end, start.minute);
    start = setTimeHoureMinute(start.houre, start.minute);

    if (now < end && now < start) {
        return false
    } else if (now >= start && now > end) {
        return false
    } else {
        return true
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