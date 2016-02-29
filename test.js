
  var SerialPort = require("serialport").SerialPort;
  var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
  });

  var binary = require('binary');

  var cmdStart = new Buffer(['K 2\r\n']);
  var cmdReq = new Buffer(['K 2\r\n']);

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
          
          console.log(vars);
          var conc = (vars.high_level*256) +vars.low_level;
          var temp_co2 = vars.temp_co2 - 40;
          if(!conc == 0){
            console.log("CO2 Conc: ", conc, " Temp: ", temp_co2);
          }else{
            //console.log(vars);
          }
      });
    });

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
    });
  }

  init();