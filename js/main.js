import {Player} from './player.js';
import {Food} from './food.js';

let x, y, player, scrollSpeed=0.2, allFood = [];

let edgeSize = 200;
let timer = null;

window.addEventListener('mousemove', () => {
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
});

function loadFood(num){
  for (let i = 0 ; i < num; i++){
    let food = new Food;
    food.createObject();
    allFood.push(food);
  }
}
function loadPlayer(){
  player = new Player(200,200);
  player.createObject();
}
function checkEat(){
  player.move(x,y);
  let playerPos = player.getObject().getBoundingClientRect();
  for (let i = 0; i < allFood.length; i++){
    //console.log(i);
    if (allFood[i].checkCollision(playerPos.x, playerPos.y, player.getSize())){
      allFood.splice(i, 1);
      if (player.eat() && scrollSpeed > 0.05){
        scrollSpeed -= 0.01;
      }
      console.log(scrollSpeed);
      break;
    }
  }
}
loadPlayer();
loadFood(50);
console.log(allFood);
console.log(player);
setInterval(checkEat, 100);
