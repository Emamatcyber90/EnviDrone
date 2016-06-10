module.exports = (function(){
  var serialModule = require("serialport");
  var port = "/dev/ttyAMA0";
  var delimiter = "\r\n";
  var socket = require('./socketio');

  var FanController = require('./FanController');
  var HumidityController = require('./HumidityController');
  var CarbonController = require('./CarbonController');

  serialPort = new serialModule.SerialPort(port, { parser: serialModule.parsers.readline(delimiter), baudrate: 9600}, false);
  
  serialPort.open(function(err) {
    serialPort.on("data", function (data) {
      if (typeof data !== "undefined" && data !== null) {
        data = data.split(" ");

        if (data[1] == "H"){
          //[ '', 'H', '00523', 'T', '01251', 'Z', '02001', 'z', '02001' ]
          var out = {};
          out.humidity = parseInt(data[2])/10;
          out.temp = (parseInt(data[4]) - 1000) / 10;
          out.z = parseInt(data[6]);


          //Emit and Pass data to controllers
          
          CarbonController(out.z);
          HumidityController(out.humidity);

          socket.emit('temp', { temp: out.temp});
          socket.emit('humidity', { humidity: out.humidity});
          socket.emit('carbon', { carbon: out.z});

          console.log(out);
        }
      }
    });


    setTimeout(function() { serialPort.write("*\r\n"); }, 1000);
    setTimeout(function() { serialPort.write("K 1\r\n"); }, 5000);
  });
})();