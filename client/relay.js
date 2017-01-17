var gpio = require('rpi-gpio');

var allPins = [7, 11, 13, 15, 16, 18];

function Init(cb) {
    /**
      7 - co2
      11 - Water Pump
      13 - dehumidifier
      15 - Fan
     */

    allPins.forEach(function(el, index, array) {

        gpio.setup(el, gpio.DIR_OUT, Relay.bind(null, el, 1));
    });

    setTimeout(function() {
        cb();
    }, 15000);
}

function Relay(p, v) {
    gpio.write(p, v, writeErrorHandle.bind(null, p, v));
}

function writeErrorHandle(err, p, v) {
    if (err) {
        Relay.bind(null, p, v);
    }
}

function exitHandler(options, err) {

    if (options.cleanup) {
        gpio.destroy(function() {
            allPins.forEach(function(el, index, array) {
                Relay.bind(null, el, true); //off
            });
        });
    }

    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null, {
    cleanup: true
}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
    exit: true
}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
    exit: true
}));

module.exports.Init = Init;
module.exports.Relay = Relay;
