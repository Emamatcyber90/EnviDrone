  var EventEmitter = require('events').EventEmitter;
  var emitter = new EventEmitter();

  var SerialPort = require("serialport").SerialPort;
  var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
  });

  var binary = require('binary');

  var cmdReq = new Buffer([0xff, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79]);
  var cmdRes = new Buffer([0xff, 0x86, 0x02, 0x60, 0x47, 0x00, 0x00, 0x00, 0xd1]);

  serialPort.on("open", function () {
    serialPort.on('data', function(data) {
      binary(data)
      .word8('a')
      .word8('b')
      .word8('high_level')
      .word8('low_level')
      .word8('temp_co2')
      .word8('f')
      .word8('g')
      .word8('h')
      .tap(function (vars) {
        
          var conc = (vars.high_level*256) +vars.low_level;
          var temp_co2 = vars.temp_co2 - 40;
          if(!conc == 0){
            //console.log("CO2 Conc: ", conc, " Temp: ", temp_co2);
            emitter.emit('data', conc, temp_co2);
          }else{
            //console.log(vars);
          }
      });
    });

    getPPM();
  });

  function getPPM(){
    serialPort.write(cmdReq, function(err, results) {
      if(err){
        console.log('err ' + err);
      }

      setTimeout(getPPM, 1000);
    });
  }

module.exports = emitter;