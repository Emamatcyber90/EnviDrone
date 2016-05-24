var shell = require('shelljs');
var UUID = shell.exec('sudo blkid -s UUID -o value /dev/mmcblk0p2', {silent:true}).stdout;

var settings = require('../config');

function announce(){
  setTimeout(function(){
    console.log('ID:',UUID);
    announce();
  }, 10000);
}

announce();

function Init(){
  /*
  Initiate Carbon & Humidity System
   */
  var CarbonController = require('./CarbonController');

  /*
  Initiate Watering System 
   */
  var WaterController = require('./WaterController');

}

/*
Initiate GPIO ports
 */
var gpioReady = require('./relay').Init;

gpioInit(Init);