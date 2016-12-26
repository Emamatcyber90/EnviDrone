module.exports = (function() {
    var moment = require('moment')
    var settings = require('../config');
    var shell = require('shelljs');
    var FormatTime = require('./TimeService').FormatTime;
    var SetTime = require('./TimeService').SetTime;
    settings.config.id = shell.exec("ifconfig eth0 | awk '/HWaddr/ {print $5}'", {
        silent: true
    }).stdout.replace("\n", "").replace(/:/g, "") || 'DemoNode';

    var URI = "https://envidash.herokuapp.com/";
    var demoURI = "http://localhost:3000";

    var socket = require('socket.io-client')(URI);

    socket.on('connect', function() {
        //settings.config.ip = shell.exec("ifconfig eth0 | awk '/HWaddr/ {print $5}'", {silent:true}).stdout.replace("\n", "").replace(/:/g, "")
        console.log(settings.config)

        emit('register', settings.config);

        //sendSettings();
    });

    socket.on('disconnect', function() {

    });

    

    socket.on('update settings', function(data) {
        console.log('***** Data Update *****', data);
        if (data.id == settings.config.id) {
            settings.config.carbon = data.carbon;
            settings.config.humidity = data.humidity;
            settings.config.lightOn = data.lightOn;
            settings.config.offTime = SetTime(data.lightOn, parseInt(data.lightOff));
            settings.config.onTime =  SetTime(data.lightOn, 0);
            settings.config.lightOff = data.lightOff;
            settings.config.waterCycle = data.waterCycle;
            settings.config.fanOnStep = data.fanOnStep;
            settings.config.tmpStep = data.tmpStep;
            settings.config.waterDuration = data.waterDuration;

            console.log('***** SAVED *****', settings.config);
        }
    });

    socket.on('git pull', function(data) {
        console.log('***** Updating Git & Restarting *****');
        shell.cd('/home/pi/EnviDrone');
        shell.exec("git pull", {
            silent: true
        });
        shell.exec("sudo pm2 restart 0", {
            silent: true
        });
    });

    function sendSettings() {
        setTimeout(function() {
            emit('settings', settings.config);
            sendSettings();
        }, 10000)

    }


    var emit = function(key, value) {

        value.id = settings.config.id;
        console.log(value);
        socket.emit(key, value);
    }

    return {
        emit: emit
    }
})();
