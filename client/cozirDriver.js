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
        if ((olds[keyName] - area) > newValue || (olds[keyName] + area) < newValue) {
            olds[keyName] = newValue;

            settings.config.olds = olds
            return true
        } else {
            return true
        }
    }

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
                    console.log(out)
                    CarbonController(out.z);
                    HumidityController(out.humidity);
                    TempController(out.temp);
                    if (calcuateSocket("temp", 1, out.temp)) {
                        socket.post('/drone/temp', {
                            temp: out.temp
                        });
                    }
                    if (calcuateSocket("humidity", 1, out.humidity)) {
                        socket.post('/drone/humidity', {
                            humidity: out.humidity
                        });
                    }
                    if (calcuateSocket("carbon", 5, out.z)) {
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