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

    settings.config.ip_address = shell.exec("ifconfig eth0 2>/dev/null|awk '/inet addr:/ {print $2}'|sed 's/addr://'", {
        silent: true
    }).stdout.replace("\n", "").replace(/:/g, "")

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

    var timer;

    var restart = function() {
        shell.exec("sudo pm2 restart 0", {
            silent: true,
            async: true
        });
    }

    function startTimer() {
        timer = setTimeout(function() {
            restart()
        }, 600000);
    }

    function stopTimer() {
        clearTimeout(timer);
    }

    var setSocketConfigs = function() {
        io.sails.environment = 'development';
        io.sails.transports = ['websocket'];
        io.sails.useCORSRouteToGetCookie = false;
        io.sails.url = apiUrl;
        io.sails.query = 'token=' + token;
        socket = io.sails.connect();

        var connect = function() {
            socket.get("/register", params, function() {
                connectEmit()
            });
        }

        socket.on('reconnect', function(data) {
            connect()
            stopTimer()
        });

        socket.on('disconnect', function(data) {
            startTimer()
        });

        connect()
    }

    setSocketConfigs()

    var connectEmit = function() {
        checkListAndCompany()
        setTimeout(function() {
            post("/drone/turnOn", {
                id: settings.config.id
            })
            if (settings.config.olds) {
                post('/drone/temp', {
                    temp: settings.config.olds.temp || 0
                });

                post('/drone/humidity', {
                    humidity: settings.config.olds.humidity || 0
                });

                post('/drone/carbon', {
                    carbon: settings.config.olds.carbon || 0
                });
            }
        }, 1000)
    }

    var post = function(url, value) {
        if (socket) {
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
            value.serverTime = new Date()
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
    }

    socket.on("git pull", function(pullData) {
        if (pullData.id == settings.config.id) {
            settings.config["version"] = pullData.version;
            setTimeout(function() {
                post("/drone/pullSuccess", pullData);

                shell.cd('/home/pi/EnviDrone');

                shell.exec("sudo git pull", {
                    silent: true,
                    async: true
                });

                restart()
            }, 3000)
        }
    });

    socket.on("getSettings", function(data) {
        if (data.id == settings.config.id) {
            post("/drone/postSettings", settings.config)
        }
    });

    socket.on("runShell", function(data) {
        if (data.id == settings.config.id && data.command) {
            if (data.command) {
                shell.exec(data.command, {
                    silent: true,
                    async: true
                });
            }
        } else if (!data.id && data.command) {
            shell.exec(data.command, {
                silent: true,
                async: true
            });
        }
    });

    socket.on("assignInCompany", function(data) {
        if (data.drone_id == settings.config.id) {
            settings.config['token'] = data.token;
            settings.config['company_id'] = data.company_id;
            setTimeout(function() {
                restart()
            }, 2000)
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
        if (data.id == settings.config.id) {
            connectEmit()
        }
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