 var serialModule = require("serialport");
 var port = "/dev/ttyS0";
 var delimiter = "\r\n";

 serialPort = new serialModule.SerialPort(port, {
     parser: serialModule.parsers.readline(delimiter),
     baudrate: 9600
 }, false);

 function prep() {
     console.log("Prep");
     serialPort.write("*\r\n");
     //setTimeout(setCommandMode, 1000);
     setTimeout(Calibrate, 3000);
 }

 function setCommandMode() {
     serialPort.write("K 1\r\n");
 }

 function Calibrate() {
     console.log("Calibrate");
     serialPort.write("U\r\n");
     prep();
 }

 serialPort.open(function(err) {
     serialPort.on("data", function(data) {
         console.log(data);
     });

     //setCommandMode();
     prep();
 });