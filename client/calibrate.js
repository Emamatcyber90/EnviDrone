module.exports = (function() {
    var serialModule = require("serialport");
    var port = "/dev/ttyS0";
    var delimiter = "\r\n";

    serialPort = new serialModule.SerialPort(port, {
        parser: serialModule.parsers.readline(delimiter),
        baudrate: 9600
    }, false);

    function prep() {
        serialPort.write("*\r\n");
        //setTimeout(setCommandMode, 1000);
        setTimeout(Calibrate, 3000);
    }

    function setCommandMode() {
        console.log('set Command Mode');
        serialPort.write("K 1\r\n");
    }

    function Calibrate() {
        console.log('Calibration started');
        serialPort.write("U\r\n");
        prep();
    }

    serialPort.open(function(err) {
        serialPort.on("data", function(data) {
            if (typeof data !== "undefined" && data !== null) {
                console.log(data);
            }
        });

        //setCommandMode();
        prep();
    });
})();