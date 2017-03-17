var cozirFunction = function() {
    var serialModule = require("serialport");
    var port = "/dev/ttyS0";
    var delimiter = "\r\n";
    var HumidityController = require('./HumidityController')()
    var CarbonController = require('./CarbonController')()
    var TempController = require('./TempController')()
    var settings = require('../config');
    var lastReading = {};

    var olds = {
        'temp': 0,
        'humidity': 0,
        'carbon': 0
    }
    serialPort = new serialModule.SerialPort(port, {
        parser: serialModule.parsers.readline(delimiter),
        baudrate: 9600
    }, false);

    function prep() {
        serialPort.write("*\r\n");
        setTimeout(setCommandMode, 1000);
        setTimeout(disableAutoCalibrate, 6000);
        setTimeout(setStreamMode, 12000);
    }

    var timer
    time = Number(new Date());

    function startTimer() {
        timer = setTimeout(function() {
            socket.post('/drone/temp', {
                temp: 0
            });
            socket.post('/drone/humidity', {
                humidity: 0
            });
            socket.post('/drone/carbon', {
                carbon: 0
            });

            olds = {
                'temp': 0,
                'humidity': 0,
                'carbon': 0
            }
            settings.config.olds = olds
            CarbonController(0);
            HumidityController(0);
            TempController(0);
        }, 30000);
    }

    function stopTimer() {
        clearTimeout(timer);
    }

    function setStreamMode() {
        serialPort.write("K 1\r\n");
    }

    function setCommandMode() {
        serialPort.write("K 0\r\n");
    }

    function disableAutoCalibrate() {
        serialPort.write("@ 0\r\n");
    }

    function calcuateSocket(keyName, area, newValue) {
        stopTimer();
        startTimer();
        if ((olds[keyName] - area) > newValue || (olds[keyName] + area) < newValue) {
            olds[keyName] = newValue;

            settings.config.olds = olds
            return true
        } else {
            return false
        }
    }

    startTimer();

    serialPort.open(function(err) {
        serialPort.on("data", function(data) {
            if (typeof data !== "undefined" && data !== null) {
                data = data.split(" ");

                if (data[1] == "H") {
                    //[ '', 'H', '00523', 'T', '01251', 'Z', '02001', 'z', '02001' ]
                    var out = {};

                    out.humidity = parseInt(data[2]) / 10;
                    out.temp = (parseInt(data[4]) - 1000) / 10;
                    out.z = parseInt(data[6]);
                    CarbonController(out.z);
                    HumidityController(out.humidity);
                    TempController(out.temp);
                    out.temp = out.temp ? out.temp : 0;
                    if (calcuateSocket("temp", 1, out.temp)) {
                        socket.post('/drone/temp', {
                            temp: out.temp
                        });
                    }

                    out.humidity = out.humidity ? out.humidity : 0;
                    if (calcuateSocket("humidity", 1, out.humidity)) {
                        socket.post('/drone/humidity', {
                            humidity: out.humidity
                        });
                    }

                    out.z = out.z ? out.z : 0;
                    if (calcuateSocket("carbon", 25, out.z)) {
                        socket.post('/drone/carbon', {
                            carbon: out.z
                        });
                    }
                }
            }
        });
    });

    function sendReports() {
        setTimeout(function() {
            socket.post("/reports/sendPinsReports", olds);
            sendReports();
        }, 300000)
    };

    sendReports()

    setTimeout(prep, 1000);
};

module.exports = cozirFunction;