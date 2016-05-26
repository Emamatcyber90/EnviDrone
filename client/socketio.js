module.exports = (function(){
  var settings = require('../config');
  var shell = require('shelljs');
  var UUID = shell.exec('sudo blkid -s UUID -o value /dev/mmcblk0p2', {silent:true}).stdout;

  var socket = require('socket.io-client')('https://envidash.herokuapp.com/');

  socket.on('connect', function(){
    settings.id = UUID;
    emit('settings', settings);

    sendSettings();
  });

  socket.on('disconnect', function(){

  });

  socket.on('update settings', function(data){
    settings = data;
  });

  function sendSettings(){
    setTimeout(function(){
      emit('settings', settings);
    }, 10000)
    
  }


  var emit = function(key, value){
      console.log(key, value);

      socket.emit(key, value);
  }

  return {
    emit: emit
  }
})();