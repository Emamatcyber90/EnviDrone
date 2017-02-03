    var serialModule = require("serialport");
    var port = "/dev/ttyS0";
    var delimiter = "\r\n";

    serialPort = new serialModule.SerialPort(port, {
        parser: serialModule.parsers.readline(delimiter),
        baudrate: 9600
    }, false);



    serialPort.open(function(err) {
        serialPort.on("data", function(data) {
          console.log("Data:", data);
        });
    });
