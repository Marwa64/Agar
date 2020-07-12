
const express = require('express');
const app = express();
let server = require('http').createServer(app);
const io = require('socket.io')(server);

let num = 0, id = 0, players=[];

app.use(express.static(__dirname + '/public/'));

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  num++;
  // Creates a new player and adds it to the array that contains all the players
  let newPlayer = {id: socket.id,
                    x: Math.floor(Math.random() * 2400),
                    y: Math.floor(Math.random() * 1500),
                    size: 1}
  players.push(newPlayer);

  // Sends both the current player and all the other players the object containing the details of the current player
  socket.emit('newPlayer', {newPlayer: newPlayer});
  socket.broadcast.emit('newPlayer', {newPlayer: newPlayer});
  // Sends an array containing all the current players to all the players
  socket.emit('currentPlayers', {players: players});
  // Receives the updated coordinates of one of the players, updates it in the array, and sends it to all the other players
  socket.on('playerMove', player => {
    for (let i = 0; i < players.length; i++){
      if (players[i].id === player.playerInfo.id){
        players[i].x = player.playerInfo.x;
        players[i].y = player.playerInfo.y;
        socket.broadcast.emit('updatePlayer', {player: players[i]});
        break;
      }
    }
  })

  socket.on('disconnect', () => {
    num--;
    io.sockets.emit('broadcast', {description: 'Number of players: ' + num, players: players});
    for (let i = 0; i < players.length; i++){
      if (players[i].id === socket.id){
        socket.broadcast.emit('playerLeave', {id: players[i].id});
        players.splice(i, 1);
        break;
      }
    }
  });
});

server.listen(3000, function() {
   console.log('listening on *:3000');
});
