var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyAMA0", {
  baudrate: 9600
});

var Parser = require('binary-parser').Parser;

var cmdStart = new Buffer(['K 2\r\n']);
var cmdReq = new Buffer(['Z\r\n']);

serialPort.on("open", function () {
  serialPort.on('data', function(data) {

    console.log(data);

    getPPM();
  });

  function init(){
    serialPort.write(cmdStart, function(err, results) {
      if(err){
        console.log('err ' + err);
      }

    });
  }

  function getPPM(){
    serialPort.write(cmdReq, function(err, results) {
      if(err){
        console.log('err ' + err);
      }

      setTimeout(getPPM, 1000);
    })
  }

  init();
})