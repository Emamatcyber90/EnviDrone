module.exports = (function(){
  var gpio = require('./relay').Relay;
  var PIN = 13;
  var settings = require('../config');

  var ON = function(){
    gpio(PIN, false);
  }

  var OFF = function(){
    gpio(PIN, true);
  }

  var analyze = function(data){
    
    if(settings.humidity >= data['h']){
      ON();
    }else{
      OFF();
    }
  }

  return analyze;

})();