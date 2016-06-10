module.exports = (function(){
  var gpio = require('./relay').Relay;
  var PIN = 7;
  var moment = require('moment');
  var settings = require('../config');
  var socket = require('./socketio');
  var serialPort = "/dev/ttyAMA0";




})();