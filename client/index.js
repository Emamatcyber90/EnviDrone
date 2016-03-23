var shell = require('shelljs');
var uuid = shell.exec('sudo blkid -s UUID -o value /dev/mmcblk0p2', {silent:true}).stdout;

// Prepare GPIO ports.
var relayInit = require('./relay').Init;
relayInit();

// ZeroConfig
var PORT = 6024;
var MULTICAST_ADDR = '239.255.255.250';
var dgram = require('dgram');
var client = dgram.createSocket('udp4');

var io = {};

client.on('listening', function () {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
});

client.on('message', function (message, rinfo) {
    console.log('Message from: ' + rinfo.address + ':' + rinfo.port + ' - ' + message);
    bindSocketIO('http://' + rinfo.address + ':7777');
});

client.bind(PORT, function () {
    console.log('add addMembership');
    client.addMembership(MULTICAST_ADDR);
});


// Socket.IO
function bindSocketIO(host){
  io = require('socket.io-client')(host);

  io.on('connect', function(){
    console.log("Connected");
    client.dropMembership(MULTICAST_ADDR);

    io.emit('private message', 'Hello World');
    GetPPM();
  });

  io.on('event', function(data){
    console.log("Event", data);
  });

  io.on('disconnect', function(){
    console.log("Disconnect");
    client.addMembership(MULTICAST_ADDR);
  });
}

var co2 = require("./co2");

function GetPPM(){
  co2.on('data',function(conc, temp_co2){
    console.log("CO2 Conc: ", conc, " Temp: ", temp_co2);
    var readings = "CO2 Conc: " + conc + " Temp: " + temp_co2;
    io.emit('private message', readings);
  });
}
