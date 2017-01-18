var moment = require('moment')
var settings = require('../config');
var shell = require('shelljs');
var FormatTime = require('./TimeService').FormatTime;
var SetTime = require('./TimeService').SetTime;

var io = require('sails.io.js')(require('socket.io-client'));

var socketio = function() {

    settings.config.id = shell.exec("ifconfig eth0 | awk '/HWaddr/ {print $5}'", {
        silent: true
    }).stdout.replace("\n", "").replace(/:/g, "") || 'DemoNode';

    var socket;

    io.sails.autoConnect = false;
    var params = {}
    if (settings.config.token) {
        var token = settings.config.token;
        params["isAdmin"] = 0;
    } else {
        var token = 'super_admin_room';
        params["isAdmin"] = 1;
    }
    var setSocketConfigs = function() {
        io.sails.environment = 'development';
        io.sails.transports = ['websocket'];
        io.sails.useCORSRouteToGetCookie = false;
        io.sails.url = "https://enviserver.kulu.io";
        io.sails.query = 'token=' + token;
        socket = io.sails.connect();
        socket.get("/register", params, function(data) {});
    }

    setSocketConfigs()

    var post = function(url, value) {
        value.id = settings.config.id;
        value.drone_id = settings.config.id;
        value.name = settings.config.name
        value.description = settings.config.description
        value.list = settings.config.list
        value.company_id = settings.config.company_id
        value.token = settings.config.token
        socket.request({
            method: 'post',
            url: url,
            data: value,
            headers: {
                'Authorization': token
            }
        }, function(resData, jwres) {

        });
    }

    function sendSettings() {
        setTimeout(function() {
            post("/drone/settings", settings.config);
            sendSettings();
        }, 10000)
    };

    sendSettings()

    socket.on("git pull", function(data) {
        shell.cd('/home/pi/EnviDrone');
        shell.exec("git pull", {
            silent: true
        });
        shell.exec("sudo pm2 restart 0", {
            silent: true
        });
    });

    socket.on("getSettings", function(data) {
        if (data.id == settings.config.id) {
            post("/drone/postSettings", settings.config)
        }
    });

    socket.on("assignInCompany", function(data) {
        if (data.drone_id == settings.config.id) {
            settings.config['token'] = data.token;
            settings.config['company_id'] = data.company_id;
        }
    });

    socket.on("updateDroneInformation", function(data) {
        console.log("updateDroneInformation", data)
        var updateData = data[0];
        if (updateData.mac_address == settings.config.id) {
            settings.config['name'] = updateData.name
            settings.config['description'] = updateData.description
            settings.config['list'] = updateData.list
        }
    });

    socket.on("updateSettings", function(data) {
        if (data.id == settings.config.id) {
            settings.config.carbon = data.carbon;
            settings.config.humidity = data.humidity;
            settings.config.lightOn = data.lightOn;
            settings.config.offTime = SetTime(data.lightOn, parseInt(data.lightOff));
            settings.config.onTime = SetTime(data.lightOn, 0);
            settings.config.lightOff = data.lightOff;
            settings.config.waterCycle = data.waterCycle;
            settings.config.fanOnStep = data.fanOnStep;
            settings.config.tmpStep = data.tmpStep;
            settings.config.waterDuration = data.waterDuration;

            post("/drone/save", settings.config)
        }
    });

    socket.on("removeListEmit", function(data) {
        if (data.mac_address == settings.config.id) {
            settings.config.list = false
        }
    });

    socket.on("updateListEmit", function(data) {
        if (settings.config.list) {
            if (data.id == settings.config.list.id) {
                settings.config.list = data
            }
        }
    });

    socket.on("getActiveDrones", function(data) {
        if (data.id == settings.config.id) {
            post('/drone/register', settings.config);
        }
    });

    post('/drone/register', settings.config);

    socket.on("disconnect", function(data) {
        connectAgain()
    });

    var connectAgain = function() {
        console.log(1111, conected)
        socket = io.sails.connect()
        setTimeout(function() {
            socket.on("connect", function(data) {
                return
            });
            connectAgain()
        }, 2000)
    }

    process.on('exit', function(exit) {
        post('/drone/turnOff', {
            id: settings.config.id,
            status: false
        });
    });
    return {
        post: post
    }
};

module.exports = socketio