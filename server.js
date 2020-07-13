
const express = require('express');
const app = express();
let server = require('http').createServer(app);
const io = require('socket.io')(server);

let num = 0, id = 0, players=[], allFood=[], deadlySquares = [];

app.use(express.static(__dirname + '/public/'));

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});

for (let i = 0 ; i < 70; i++){
  let food = {x: Math.floor(Math.random() * 2400),
              y: Math.floor(Math.random() * 2400)};

  allFood.push(food);
}

for (let i = 0; i < 15; i++){
  let square = {x: Math.floor(Math.random() * 2400),
                y: Math.floor(Math.random() * 2400)};
  deadlySquares.push(square);
}

io.on('connection', socket => {
  num++;
  // Creates a new player and adds it to the array that contains all the players
  let newPlayer = {id: socket.id,
                    x: Math.floor(Math.random() * 2400),
                    y: Math.floor(Math.random() * 1500),
                    size: 1};
  players.push(newPlayer);

  // Sends both the new player and all the other players the object containing the details of the new player
  socket.emit('newPlayer', {description: 'Number of players: ' + num, newPlayer: newPlayer});
  socket.broadcast.emit('newPlayer', {description: 'Number of players: ' + num, newPlayer: newPlayer});
  // Sends an array containing all the current players and all the current food to the new player
  socket.emit('currentData', {players: players, food: allFood, squares: deadlySquares});
  // Receives the updated coordinates of one of the players, updates it in the array, and sends it to all the other players
  socket.on('playerMove', player => {
    for (let i = 0; i < players.length; i++){
      if (players[i].id === player.playerInfo.id){
        players[i].x = player.playerInfo.x;
        players[i].y = player.playerInfo.y;
        players[i].size = player.playerInfo.size;
        socket.broadcast.emit('updatePlayer', {player: players[i]});
        break;
      }
    }
  });

  socket.on('eat', food => {
    for (let i = 0; i < allFood.length; i++){
      if ( (allFood[i].x === food.foodEaten.x) && (allFood[i].y === food.foodEaten.y) ){
        socket.broadcast.emit('removeFood', {foodEaten: allFood[i]});
        allFood.splice(i, 1);
        let newFood = {x: Math.floor(Math.random() * 2400),
                    y: Math.floor(Math.random() * 1500)};
        allFood.push(newFood);
        socket.emit('addFood', {newFood: newFood});
        socket.broadcast.emit('addFood', {newFood: newFood});
        break;
      }
    }
  });

  socket.on('playerKill', player => {
    num--;
    for (let i = 0; i < players.length; i++){
      if (players[i].id === player.playerID){
        socket.emit('playerDead', {playerID: players[i].id, description: 'Number of players: ' + num});
        socket.broadcast.emit('playerDead', {playerID: players[i].id, description: 'Number of players: ' + num});
        players.splice(i,1);
        break;
      }
    }
  });

  socket.on('disconnect', () => {
    num--;
    for (let i = 0; i < players.length; i++){
      if (players[i].id === socket.id){
        socket.broadcast.emit('playerLeave', {description: 'Number of players: ' + num, id: players[i].id});
        players.splice(i, 1);
        break;
      }
    }
  });
});

server.listen(3000, function() {
   console.log('listening on *:3000');
});
