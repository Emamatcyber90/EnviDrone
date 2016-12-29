var cozirFunction = function() {
    var serialModule = require("serialport");
    var port = "/dev/ttyS0";
    var delimiter = "\r\n";
    var socket = require('./socketio')();

    var HumidityController = require('./HumidityController')()
    var CarbonController = require('./CarbonController')()
    var TempController = require('./TempController')()
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
        console.log('Prep COZIR');
        serialPort.write("*\r\n");
        setTimeout(setCommandMode, 1000);
        setTimeout(disableAutoCalibrate, 6000);
        setTimeout(setStreamMode, 12000);
    }

    function setStreamMode() {
        //console.log('Stream Mode');
        serialPort.write("K 1\r\n");
    }

    function setCommandMode() {
        //console.log('set Command Mode');
        serialPort.write("K 0\r\n");
    }

    function disableAutoCalibrate() {
        //console.log('disable Auto Calibrate');
        serialPort.write("@ 0\r\n");
    }

    function calcuateSocket(keyName, area, newValue) {
        if ((olds[keyName] - area) > newValue || (olds[keyName] + area) + newValue) {
            olds[keyName] = newValue;
            return true
        } else {
            olds[keyName] = newValue;
        }
    }

    serialPort.open(function(err) {
        serialPort.on("data", function(data) {
            //console.log('Raw Data', data);
            if (typeof data !== "undefined" && data !== null) {
                data = data.split(" ");

                if (data[1] == "H") {
                    //[ '', 'H', '00523', 'T', '01251', 'Z', '02001', 'z', '02001' ]
                    var out = {};
                    out.humidity = parseInt(data[2]) / 10;
                    out.temp = (parseInt(data[4]) - 1000) / 10;
                    out.z = parseInt(data[6]);
                    console.log(out);

                    //Emit and Pass data to controllers

                    CarbonController(out.z);
                    HumidityController(out.humidity);
                    TempController(out.temp);
                    if (calcuateSocket("temp", 1, out.temp)) {
                        socket.emit('temp', {
                            temp: out.temp
                        });
                    }
                    if (calcuateSocket("humidity", 1, out.humidity)) {
                        socket.emit('humidity', {
                            humidity: out.humidity
                        });
                    }
                    if (calcuateSocket("carbon", 50, out.z)) {
                        socket.emit('carbon', {
                            carbon: out.z
                        });
                    }
                }
            }
        });
    });

    setTimeout(prep, 1000);
};

module.exports = cozirFunction;