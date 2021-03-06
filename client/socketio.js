var moment = require('moment');
var settings = require('../config');
var shell = require('shelljs');

var io = require('sails.io.js')(require('socket.io-client'));

var socketio = function() {
    
    if (typeof settings.config.id === 'undefined') {
        settings.config.id = Math.random().toString(36).slice(2);
    }
    
    shell.exec("sudo rm /etc/localtime && sudo ln -s /usr/share/zoneinfo/America/Phoenix /etc/localtime", {
        silent: true,
        async: true
    });

    settings.config.ip_address = shell.exec("ifconfig eth0 2>/dev/null|awk '/inet / {print $2}'|sed 's/addr://'", {
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

    var apiUrl = process.env.local ? "http://192.168.1.8:1337" : "https://enviserver.kulu.io";

    var timer;

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
            value.version = settings.config.version
            value.serverTime = moment(new Date()).format("M-D-YY HH:mm:ss")
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

    var restart = function() {

        post("/drone/emit", {
            id: settings.config.id,
            socketName: "turnOff"
        })
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
            post("/drone/emit", {
                id: settings.config.id,
                socketName: "turnOn"
            })

            post("/drone/emit", {
                waterTime: settings.config.waterTime,
                socketName: "updateWaterTime"
            })

            if (settings.config.olds) {
                post('/drone/emit', {
                    temp: settings.config.olds.temp || 0,
                    socketName: "temp"
                });

                post('/drone/emit', {
                    humidity: settings.config.olds.humidity || 0,
                    socketName: "humidity"
                });

                post('/drone/emit', {
                    carbon: settings.config.olds.carbon || 0,
                    socketName: "carbon"
                });

                post('/drone/emit', {
                    lighted: settings.config.tmpStepStatus,
                    socketName: "switchStatus"
                });
            }
        }, 1000)
    }

    var sendNotification = function(message) {
        if (socket) {
            socket.request({
                method: 'post',
                url: "/drone/sendNotifications",
                data: {
                    drone_id: settings.config.id,
                    body: message
                },
                headers: {
                    'Authorization': token
                }
            }, function(resData, jwres) {

            });
        }
    }
    var createLastSetting = function() {
        var config = settings.config;
        config.socketName = "createLastSettings";
        post("/drone/emit", settings.config)
        config.socketName = "save";
        post("/drone/emit", settings.config)
    }

    socket.on("git pull", function(pullData) {
        if (pullData.id == settings.config.id) {
            console.log("Pull working")
            settings.config["version"] = pullData.version;
            setTimeout(function() {
                post("/drone/emit", {
                    socketName: 'pullSuccess',
                    message: "Success"
                });

                shell.exec("cd /home/pi/EnviDrone && sudo git pull", {
                    silent: true,
                    async: true
                });

                restart()
            }, 3000)
        }
    });

    socket.on("getSettings", function(data) {
        if (data.id == settings.config.id) {
            var config = settings.config;
            config.socketName = "receive settings";
            post("/drone/emit", config)
            post("/drone/emit", {
                statuses: settings.config.statuses,
                socketName: "changeStatuses"
            })
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
            settings.config.carbon = data.carbon || 0;
            settings.config.humidity = data.humidity || 0;
            settings.config.lightOn = data.lightOn || 0;
            settings.config.lightOff = data.lightOff || 0;
            settings.config.waterCycle = data.waterCycle || 0;
            settings.config.fanOnStep = data.fanOnStep || 0;
            settings.config.waterDuration = data.waterDuration || 0;
            settings.config.fanOnStepHumiditly = data.fanOnStepHumiditly || 0;
            settings.config.tmpStep = data.tmpStep || 0;
            settings.config.notifications = data.notifications;
            settings.config.automated = false;

            createLastSetting()
        }
    });

    socket.on("updateManual", function(data) {
        if (data.id == settings.config.id) {
            settings.config.manual.status = data.status;
            settings.config.manual.carbonOnStep = data.carbonOnStep || 10000;
            settings.config.manual.humidityOnStep = data.humidityOnStep || 10000;
            settings.config.manual.tmpOnStep = data.tmpOnStep || 10000;
            var manual = settings.config.manual
            manual.socketName = "save"
            post("/drone/emit", manual)
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

    socket.on("reconnectAll", function(data) {
        restart()
    })

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
        var name = settings.config.name || settings.config.id;
        // sendNotification(name + " drone turn Off ");

        post("/drone/emit", {
            id: settings.config.id,
            socketName: "turnOff"
        })

        post("/drone/error", {
            drone_id: settings.config.id,
            message: done
        })
    });

    var config = settings.config;
    config.socketName = "register"
    post('/drone/emit', config);
    config.socketName = "receive settings"
    post("/drone/emit", config);
    socket.on("autoPull", function(data) {
        shell.exec("cd EnviDrone && sudo git pull origin master && sudo reboot", {
            silent: true,
            async: true
        });
    })

    socket.on("automated", function(data) {
        if (data.id == settings.config.id) {
            settings.config.carbon = data.carbon || 0;
            settings.config.lightOn = data.lightOn || 0;
            settings.config.lightOff = data.lightOff || 0;
            settings.config.automated = true;
            createLastSetting()
        }
    })

    return {
        post: post,
        sendNotification: sendNotification
    }
};

module.exports = socketio
