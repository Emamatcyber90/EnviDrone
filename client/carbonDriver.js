module.exports = (function(){
  var gpio = require('./relay').Relay;
  var PIN = 7;
  var moment = require('moment');
  var settings = require('../config');
  var socket = require('./socketio');
  var port = "/dev/ttyAMA0";
  var delimiter = "\r\n";

  serialPort = new serialModule.SerialPort(port, { parser: serialModule.parsers.readline(delimiter), baudrate: 9600}, false);

  setTimeout(function() { self._serialPort.write("*\r\n"); }, 1000);
  setTimeout(function() { self._serialPort.write("K 1\r\n"); }, 5000);


  serialPort.on("data", function (data) {
    if (typeof data !== "undefined" && data !== null) {

      console.log(data);
    }
  });
})();