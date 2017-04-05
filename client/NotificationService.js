var settings = require('../config');

function getMessage(key, value) {
    var name = settings.config.name || settings.config.id;
    return "In " + name + " drone " + key + " lavel is " + value
}

function checkNotification(key, value) {
    var objectPath = settings.config.notifications[key];
    if (settings.config.notifications.status && objectPath) {
        if (value >= objectPath.max)
            var message = getMessage(key, "max")
        else if (value <= objectPath.min)
            var message = getMessage(key, "min")
        
        objectPath.message = message;
    }
}
module.exports.checkNotification = checkNotification;