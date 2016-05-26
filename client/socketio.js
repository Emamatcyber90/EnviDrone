module.exports = (function(){
  var settings = require('../config');
  var shell = require('shelljs');
  settings.config.id = shell.exec('sudo blkid -s UUID -o value /dev/mmcblk0p2', {silent:true}).stdout.replace("\n", "") || 'DemoNode';
  
  var URI = "https://envidash.herokuapp.com/";
  var demoURI = "http://localhost:3000";

  var socket = require('socket.io-client')(URI);

  socket.on('connect', function(){
    
    emit('register', { id: settings.id });

    //sendSettings();
  });

  socket.on('disconnect', function(){

  });

  socket.on('update settings', function(data){
    settings.config = data;
  });

  function sendSettings(){
    setTimeout(function(){
      emit('settings', settings.config);
      sendSettings();
    }, 10000)
    
  }


  var emit = function(key, value){

      value.id = settings.id;
      console.log(value);
      socket.emit(key, value);
  }

  return {
    emit: emit
  }
})();