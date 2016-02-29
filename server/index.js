var SRC_PORT = 6025;
var PORT = 6024;
var MULTICAST_ADDR = '239.255.255.250';
var dgram = require('dgram');
var server = dgram.createSocket("udp4");

server.bind(SRC_PORT, function () {
    setInterval(multicastNew, 10000);
});

function multicastNew() {
    var message = new Buffer("Multicast message!");
    server.send(message, 0, message.length, PORT, MULTICAST_ADDR, function () {
        console.log("Sent '" + message + "'");
    });
}

var io = require('socket.io')(7777);

io.on('connection', function (socket) {
  io.emit('this', { will: 'be received by everyone'});

  socket.on('private message', function (msg) {
    console.log(msg);
  });

  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });
});