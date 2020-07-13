import {Player} from './player.js';
import {Food} from './food.js';
import {DeadlySquare} from './deadlySquare.js';

$(".modal").modal("show");

let x, y, thisPlayer="", scrollSpeed=0.2, allFood=[], otherPlayers=[], deadlySquares=[];
let socket;
let log = document.querySelector(".log");

let playBtn = document.querySelector("#play");
// When the player clicks on play, we'll connect to the server
playBtn.addEventListener('click', () => {
  socket = io();
  socket.on('newPlayer', data => {
    console.log("New Player!");

    // The new player created is this client if this client hasn't already been assigned a player
    if (thisPlayer === ""){
      loadPlayer(data.newPlayer.id, data.newPlayer.x, data.newPlayer.y);
      thisPlayer.getObject().scrollIntoView();
      window.addEventListener('mousemove', playerMovement);
      setInterval(checkEat, 10);
      setInterval(updateMovement, 10);
      setInterval(checkPlayerCollision, 10);
      setInterval(checkSquareCollision, 10);

    // if this client already is a player then the new player is added to the otherPlayers array
    } else {
      let otherPlayer = new Player(data.newPlayer.id);
      otherPlayer.createObject(data.newPlayer.x, data.newPlayer.y);
      otherPlayer.getObject().style.background = "green";
      otherPlayers.push(otherPlayer);
    }
    log.innerText = data.description;
  });

  // Getting an array of all the players that are currently in the game, an array of all the food, and an array of all the deadly squares when this client joins
  socket.on('currentData', data => {
    for (let i = 0; i < data.players.length; i++){
      if (data.players[i].id != thisPlayer.getID()){
        let otherPlayer = new Player(data.players[i].id);
        otherPlayer.createObject(data.players[i].x, data.players[i].y);
        otherPlayer.getObject().style.background = "green";
        otherPlayers.push(otherPlayer);
      }
    }
    for (let j = 0; j < data.food.length; j++){
      let food = new Food(data.food[j].x, data.food[j].y);
      food.createObject();
      allFood.push(food);
    }
    for (let j = 0; j < data.squares.length; j++){
      let newSquare = new DeadlySquare(data.squares[j].x, data.squares[j].y);
      newSquare.createObject();
      deadlySquares.push(newSquare);
    }
  });

  // Updating the position of one of the other players based on the coordinates sent by the server
  socket.on('updatePlayer', data => {
    for (let i = 0; i < otherPlayers.length; i++){
      if (data.player.id === otherPlayers[i].getID()){
        otherPlayers[i].setSize(data.player.size);
        otherPlayers[i].setSpeed(1);
        otherPlayers[i].move(data.player.x, data.player.y);
        break;
      }
    }
  });

  // Gets the position of the food that was eaten from the server and removes it from the allFood array
  socket.on('removeFood', data => {
    for (let i = 0; i < allFood.length; i++){
      if ( (allFood[i].getX() === data.foodEaten.x) && (allFood[i].getY() === data.foodEaten.y) ){
        allFood[i].removeObject();
        allFood.splice(i, 1);
        break;
      }
    }
  });

  // Gets the position of the new food that was generated, creates the food object, and adds it to the allFood array
  socket.on('addFood', data => {
    let newFood = new Food(data.newFood.x, data.newFood.y);
    newFood.createObject();
    allFood.push(newFood);
  });

  // Get's the ID of the player that died, if the player is this current player then we remove ourselves and disconnect. Otherwise we remove
  // the other player from our screen and array
  socket.on('playerDead', data => {
    if (data.playerID === thisPlayer.getID()){
      window.removeEventListener('mousemove', playerMovement);
      thisPlayer.removeObject();
      socket.disconnect();
    } else {
      for (let i = 0; i < otherPlayers.length; i++){
        if (data.playerID ===  otherPlayers[i].getID()){
          otherPlayers[i].removeObject();
          otherPlayers.splice(i, 1);
          break;
        }
      }
    }
    log.innerText = data.description;
  });

  // When a player leaves their object is deleted and they are removed from the otherPlayers array
  socket.on('playerLeave', data => {
    for (let i = 0; i < otherPlayers.length; i++){
      if (data.id ===  otherPlayers[i].getID()){
        otherPlayers[i].removeObject();
        otherPlayers.splice(i, 1);
        break;
      }
    }
    log.innerText = data.description;
  });
});

let edgeSize = 200;
let timer = null;

function playerMovement() {
  x = event.pageX - 50;
  y = event.pageY - 55;

  thisPlayer.move(x,y);

  let viewportX = event.clientX;
  let viewportY = event.clientY;

  let viewportWidth = document.documentElement.clientWidth;
  let viewportHeight = document.documentElement.clientHeight;

  let edgeTop = edgeSize;
  let edgeLeft = edgeSize;
  let edgeBottom = ( viewportHeight - edgeSize );
  let edgeRight = ( viewportWidth - edgeSize );

  let isInLeftEdge = ( viewportX < edgeLeft );
  let isInRightEdge = ( viewportX > edgeRight );
  let isInTopEdge = ( viewportY < edgeTop );
  let isInBottomEdge = ( viewportY > edgeBottom );

  if ( ! ( isInLeftEdge || isInRightEdge || isInTopEdge || isInBottomEdge ) ) {
    clearTimeout( timer );
    return;
  }
  var documentWidth = Math.max(
    document.body.scrollWidth,
    document.body.offsetWidth,
    document.body.clientWidth,
    document.documentElement.scrollWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
  var documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.body.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
  var maxScrollX = ( documentWidth - viewportWidth );
  var maxScrollY = ( documentHeight - viewportHeight );

  (function checkForWindowScroll() {
    clearTimeout( timer );
    if ( adjustWindowScroll() ) {
      timer = setTimeout( checkForWindowScroll, 30 );
    }
  })();

  function adjustWindowScroll() {
    var currentScrollX = window.pageXOffset;
    var currentScrollY = window.pageYOffset;

    var canScrollUp = ( currentScrollY > 0 );
    var canScrollDown = ( currentScrollY < maxScrollY );
    var canScrollLeft = ( currentScrollX > 0 );
    var canScrollRight = ( currentScrollX < maxScrollX );

    var nextScrollX = currentScrollX;
    var nextScrollY = currentScrollY;

    var maxStep = 50;

    // Scroll left
    if ( isInLeftEdge && canScrollLeft ) {
      nextScrollX = ( nextScrollX - ( maxStep * scrollSpeed ) );
    // Scroll right
    } else if ( isInRightEdge && canScrollRight ) {
      nextScrollX = ( nextScrollX + ( maxStep * scrollSpeed ) );
    }
    // Scroll up
    if ( isInTopEdge && canScrollUp ) {
      nextScrollY = ( nextScrollY - ( maxStep * scrollSpeed ) );
    // Scroll down
    } else if ( isInBottomEdge && canScrollDown ) {
      nextScrollY = ( nextScrollY + ( maxStep * scrollSpeed ) );
    }
    nextScrollX = Math.max( 0, Math.min( maxScrollX, nextScrollX ) );
    nextScrollY = Math.max( 0, Math.min( maxScrollY, nextScrollY ) );

    if (( nextScrollX !== currentScrollX ) || ( nextScrollY !== currentScrollY )) {
      window.scrollTo( nextScrollX, nextScrollY );
      return( true );
    } else {
      return( false );
    }
  }
}

function loadPlayer(id, x, y){
  thisPlayer = new Player(id);
  thisPlayer.createObject(x,y);
}

function checkEat(){
  let playerPos = thisPlayer.getObject().getBoundingClientRect();
  for (let i = 0; i < allFood.length; i++){
    //console.log(i);
    if (allFood[i].checkCollision(playerPos.right, playerPos.left, playerPos.top, playerPos.bottom)){
      let foodEaten = {x: allFood[i].getX(),
                       y: allFood[i].getY()};
      socket.emit('eat', {foodEaten: foodEaten});
      allFood.splice(i, 1);
      if (thisPlayer.eat() && scrollSpeed > 0.05){
        scrollSpeed -= 0.01;
      }
      break;
    }
  }
}
function  checkPlayerCollision(){
  let playerPos = thisPlayer.getObject().getBoundingClientRect();
  for (let i=0; i < otherPlayers.length; i++){
    let enemyPos = otherPlayers[i].getObject().getBoundingClientRect();
    if (playerPos.right > enemyPos.left && playerPos.left < enemyPos.right && playerPos.bottom > enemyPos.top && playerPos.top < enemyPos.bottom){
      if (thisPlayer.getSize() > otherPlayers[i].getSize()){
        console.log("Collide!");
        thisPlayer.kill(otherPlayers[i].getSize());
        socket.emit('playerKill', {playerID: otherPlayers[i].getID()});
        break;
      }
      if (thisPlayer.getSize() < otherPlayers[i].getSize()){
        window.removeEventListener('mousemove', playerMovement);
        thisPlayer.removeObject();
        socket.disconnect();
        break;
      }
    }
  }
}
function checkSquareCollision(){
  let playerPos = thisPlayer.getObject().getBoundingClientRect();
  for (let i=0; i < deadlySquares.length; i++){
    if (deadlySquares[i].checkCollision(playerPos.right, playerPos.left, playerPos.top, playerPos.bottom)){
      socket.emit('playerKill', {playerID: thisPlayer.getID()});
      break;
    }
  }
}
// Sends the current position of the player to the server, this function is called every 100ms
function updateMovement(){
  let playerPos = thisPlayer.getObject().getBoundingClientRect();
  let playerMove = {id: thisPlayer.getID(),
                    x: playerPos.x,
                    y: playerPos.y,
                    size: thisPlayer.getSize()}
  socket.emit('playerMove', {playerInfo: playerMove});
}
