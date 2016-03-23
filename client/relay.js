
  var LibRelay = {};

  LibRelay.gpio = require('rpi-gpio');

  LibRelay.Init =  function(){
    /**
      7 - co2
      11 - pump
      13 - dehumidifier
     */
    LibRelay.allPins = [7, 11, 13];

    LibRelay.allPins.forEach(function (el, index, array) {

      LibRelay.gpio.setup(el, LibRelay.gpio.DIR_OUT, LibRelay.Relay.bind(null, el, 1));
    });
  }

  LibRelay.Relay = function(p, v) {

    console.log('Set ', p, v);
    LibRelay.gpio.write(p, v, LibRelay.writeErrorHandle.bind(this));
  }

  LibRelay.writeErrorHandle = function(err){
    if (err) {
      console.log(err);
      LibRelay.Relay(p, v);
    }else{
      console.log('Written to pin');
    }
  }

  LibRelay.exitHandler = function(){
    LibRelay.gpio.destroy(function(){
      process.exit();
    });
    
  }

  // process.on('exit', exitHandler);
  // process.on('SIGINT', exitHandler);
  // process.on('uncaughtException', exitHandler);
  // 
  module.exports = LibRelay