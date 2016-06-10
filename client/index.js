var settings = require('../config');

function Init(){
  console.log('All systems ready, intiiating controllers.');

  /**
   * Initiate Socket IO
   */
  var socket = require('./socketio');
  
  /*
  Initiate Driver Carbon, Humidity & Temp System
   */
  var cozirDriver = require('./cozirDriver');

  /*
  Initiate Watering System 
   */
  var WaterController = require('./WaterController');

}

/*
Initiate GPIO ports
 */
var gpioReady = require('./relay').Init;

gpioReady(Init);