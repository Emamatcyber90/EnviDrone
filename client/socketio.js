module.exports = (function(){
  var settings = require('../config');
  var shell = require('shelljs');
  var UUID = shell.exec('sudo blkid -s UUID -o value /dev/mmcblk0p2', {silent:true}).stdout;

  var socket = require('socket.io-client')('https://envidash.herokuapp.com/');
  var isConnected = false;

  socket.on('connect', function(){
    isConnected = true;
    emit('settings', settings);
  });

  socket.on('disconnect', function(){
    isConnected = false;
  });

  socket.on('update settings', function(data){
    settings = data;
  });

  var emit = function(key, value){
    if(isConnected){
      console.log(key, value);
      socket.emit(key, value);
    }
  }

  return {
    emit: emit
  }
})();