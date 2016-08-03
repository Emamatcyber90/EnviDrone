module.exports = (function(){
  var settings = require('../config');
  var shell = require('shelljs');
  settings.config.id = shell.exec("ifconfig eth0 | awk '/HWaddr/ {print $5}'", {silent:true}).stdout.replace("\n", "").replace(/:/g, "") || 'DemoNode';

  ifconfig eth0 | awk '/inet addr:/ {print $2}'
  var URI = "https://envidash.herokuapp.com/";
  var demoURI = "http://localhost:3000";

  var socket = require('socket.io-client')(URI);

  socket.on('connect', function(){
    //settings.config.ip = shell.exec("ifconfig eth0 | awk '/HWaddr/ {print $5}'", {silent:true}).stdout.replace("\n", "").replace(/:/g, "")
    emit('register', settings.config);

    //sendSettings();
  });

  socket.on('disconnect', function(){

  });

  socket.on('update settings', function(data){
    console.log('***** Data Update *****', data);
    if(data.id == settings.config.id){
      settings.config.carbon = data.carbon;
      settings.config.humidity = data.humidity;
      settings.config.lightOn = data.lightOn;
      settings.config.lightOff = data.lightOff;
      settings.config.waterCycle = data.waterCycle;
      settings.config.waterDuration = data.waterDuration;

      console.log('***** SAVED *****', settings.config);
    }
  });

  function sendSettings(){
    setTimeout(function(){
      emit('settings', settings.config);
      sendSettings();
    }, 10000)
    
  }


  var emit = function(key, value){

      value.id = settings.config.id;
      console.log(value);
      socket.emit(key, value);
  }

  return {
    emit: emit
  }
})();