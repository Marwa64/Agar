import {Player} from './player.js';
import {Food} from './food.js';

$(".modal").modal("show");

let x, y, thisPlayer = "", scrollSpeed=0.2, allFood = [], otherPlayers=[];
let socket;

let playBtn = document.querySelector("#play");
playBtn.addEventListener('click', () => {
  socket = io();
  socket.on('newPlayer', data => {
    console.log("New Player!");

    // The new player created is this client if this client hasn't already been assigned a player
    if (thisPlayer === ""){
      loadPlayer(data.newPlayer.id, data.newPlayer.x, data.newPlayer.y);
      window.addEventListener('mousemove', playerMovement);
      setInterval(checkEat, 100);
      setInterval(updateMovement, 100);

    // if this client already is a player then the new player is added to the otherPlayers array
    } else {
      let otherPlayer = new Player(data.newPlayer.id);
      otherPlayer.createObject(data.newPlayer.x, data.newPlayer.y);
      otherPlayer.getObject().style.background = "green";
      otherPlayers.push(otherPlayer);
    }
  });

  // Getting an array of all the players that are currently in the game when this client joins
  socket.on('currentPlayers', data => {
    for (let i = 0; i < data.players.length; i++){
      if (data.players[i].id != thisPlayer.getID()){
        let otherPlayer = new Player(data.players[i].id);
        otherPlayer.createObject(data.players[i].x, data.players[i].y);
        otherPlayer.getObject().style.background = "green";
        otherPlayers.push(otherPlayer);
      }
    }
    console.log(otherPlayers);
  });

  // Updating the position of one of the other players based on the coordinates sent by the server
  socket.on('updatePlayer', data => {
    for (let i = 0; i < otherPlayers.length; i++){
      if (data.player.id === otherPlayers[i].getID()){
        otherPlayers[i].move(data.player.x, data.player.y);
        break;
      }
    }
  })

  // When a player leaves their object is deleted and they are removed from the otherPlayers array
  socket.on('playerLeave', data => {
    for (let i = 0; i < otherPlayers.length; i++){
      if (data.id ===  otherPlayers[i].getID()){
        otherPlayers[i].removeObject();
        otherPlayers.splice(i, 1);
        break;
      }
    }
  })
});

let edgeSize = 200;
let timer = null;

function playerMovement() {
  x = event.pageX - 50;
  y = event.pageY - 55;

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

function loadFood(num){
  for (let i = 0 ; i < num; i++){
    let food = new Food;
    food.createObject();
    allFood.push(food);
  }
}

function loadPlayer(id, x, y){
  thisPlayer = new Player(id);
  thisPlayer.createObject(x,y);
}

function checkEat(){
  thisPlayer.move(x,y);
  let playerPos = thisPlayer.getObject().getBoundingClientRect();
  for (let i = 0; i < allFood.length; i++){
    //console.log(i);
    if (allFood[i].checkCollision(playerPos.x, playerPos.y, player.getSize())){
      allFood.splice(i, 1);
      let newFood  = new Food;
      newFood.createObject();
      allFood.push(newFood);
      if (thisPlayer.eat() && scrollSpeed > 0.05){
        scrollSpeed -= 0.01;
      }
      break;
    }
  }
}

function updateMovement(){
  let playerPos = thisPlayer.getObject().getBoundingClientRect();
  let playerMove = {id: thisPlayer.getID(),
                    x: playerPos.x,
                    y: playerPos.y,
                    size: thisPlayer.getSize()}
  socket.emit('playerMove', {playerInfo: playerMove});
}
