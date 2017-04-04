var settings = require('../config');

function send(key, value) {
    var name = settings.name || settings.id;
    socket.sendNotification("In " + name + " drone " + key + " level is " + value);
}

module.exports.send = send;