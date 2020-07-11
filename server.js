const express = require('express');
const app = express();
let server = require('http').createServer(app);
const io = require('socket.io')(server);
let num = 0;


app.use(express.static(__dirname + '/public/'));

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  num++;
  io.sockets.emit('broadcast', {description: 'Number of players: ' + num});

  socket.on('clientEvent', data => {
    console.log(data);
  })
  socket.on('disconnect', () => {
    num--;
    io.sockets.emit('broadcast', {description: 'Number of players: ' + num});
  });
});

server.listen(3000, function() {
   console.log('listening on *:3000');
});
