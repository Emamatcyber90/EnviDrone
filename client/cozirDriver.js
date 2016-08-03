module.exports = (function(){
  var serialModule = require("serialport");
  var port = "/dev/ttyAMA0";
  var delimiter = "\r\n";
  var socket = require('./socketio');

  var HumidityController = require('./HumidityController');
  var CarbonController = require('./CarbonController');
  var lastReading = {};

  serialPort = new serialModule.SerialPort(port, { parser: serialModule.parsers.readline(delimiter), baudrate: 9600}, false);
  
  function prep(){
    serialPort.write("*\r\n");
    setTimeout(setCommandMode, 1500);
    setTimeout(disableAutoCalibrate, 3000);
    setTimeout(setStreamMode, 6000);
  }

  function setStreamMode(){
    serialPort.write("K 1\r\n");
  }

  function setCommandMode(){
    serialPort.write("K 0\r\n");
  }

  function disableAutoCalibrate(){
    serialPort.write("@ 0\r\n");
  }

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

    setTimeout(prep, 1000);
  });
})();