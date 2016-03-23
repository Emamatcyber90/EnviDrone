
var module = {};

var gpio = require('rpi-gpio');

module.Init = Init (){
  /**
    7 - co2
    11 - pump
    13 - dehumidifier
   */
  var allPins = [7, 11, 13];

  allPins.forEach(function (el, index, array) {

    gpio.setup(el, gpio.DIR_OUT, Relay.bind(null, el, 1));
  });
}

function Relay(p, v) {

  console.log('Set ', p, v);
  gpio.write(p, v, writeErrorHandle.bind(this));
}

module.Relay = Relay;

function writeErrorHandle(err){

  if (err) {
    console.log(err);
    Relay(p, v);
  }else{
    console.log('Written to pin');
  }
}

function exitHandler(){

  gpio.destroy(function(){
    process.exit();
  });
}

// process.on('exit', exitHandler);
// process.on('SIGINT', exitHandler);
// process.on('uncaughtException', exitHandler);

module.exports = module;