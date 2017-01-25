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

    var apiUrl = process.env.local ? "http://192.168.0.105:1337" : "https://enviserver.kulu.io";

    var con = false

    var connectEmit = function() {
        checkListAndCompany()
        setTimeout(function() {
            post("/drone/turnOn", {
                id: settings.config.id
            })

            post('/drone/temp', {
                temp: settings.config.olds.temp
            });

            post('/drone/humidity', {
                humidity: settings.config.olds.humidity
            });

            post('/drone/carbon', {
                carbon: settings.config.olds.carbon
            });
        }, 3000)

    }

    var setSocketConfigs = function() {
        io.sails.environment = 'development';
        io.sails.transports = ['websocket'];
        io.sails.useCORSRouteToGetCookie = false;
        io.sails.url = apiUrl;
        io.sails.query = 'token=' + token;
        socket = io.sails.connect();
        socket.get("/register", params, function(data) {});
        socket.on("disconnect", function(data) {
            con = false
        })

        socket.on("connect", function(data) {
            connectEmit()
            con = true
        })
    }

    setSocketConfigs()

    var sendAgain = function() {
        setInterval(function() {
            if (!con) {
                socket = io.sails.connect()
                socket.on("disconnect", function(data) {
                    con = false
                    post("/drone/turnOff", {
                        id: settings.config.id
                    })
                })
                socket.on("connect", function(data) {
                    socket.get("/register", params, function(data) {});
                    connectEmit()
                    con = true
                })
            }
        }, 5000)
    }

    sendAgain()

    var post = function(url, value) {
        if (url == "/reports/sendPinsReports") {
            value.light_on = settings.config.statuses.light
        }
        value.id = settings.config.id;
        value.drone_id = settings.config.id;
        value.name = settings.config.name
        value.description = settings.config.description
        value.list = settings.config.list
        value.company_id = settings.config.company_id
        value.token = settings.config.token
        value.statuses = settings.config.statuses
        value.version = settings.config.version
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

    socket.on("git pull", function(data) {
        if (data.id == settings.config.id) {
            settings.config.version = data.version;

            shell.cd('/home/pi/EnviDrone');

            shell.exec("sudo git pull", {
                silent: true,
                async: true
            });

            shell.exec("sudo pm2 restart 0", {
                silent: true,
                async: true
            });
        }
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
        console.log("Get activate list")
        connectEmit()
    });

    var checkListAndCompany = function() {
        socket.request({
            method: 'post',
            url: "/drone/check",
            data: {
                id: settings.config.id
            },
            headers: {
                'Authorization': token
            }
        }, function(resData) {
            if (resData) {
                settings.config.list = resData.list
                settings.config.company_id = resData.company
                settings.config.name = resData.name
                settings.config.description = resData.description
            }
        });
    }

    process.on('exit', function(done) {
        post("/drone/turnOff", {
            id: settings.config.id
        })
    });

    post('/drone/register', settings.config);
    post("/drone/postSettings", settings.config);

    return {
        post: post,
        setSocketConfigs: setSocketConfigs
    }
};

module.exports = socketio