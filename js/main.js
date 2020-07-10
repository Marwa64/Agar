import {Player} from './player.js';
import {Food} from './food.js';

let x, y, player, allFood = [];

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

    // Should we scroll left?
    if ( isInLeftEdge && canScrollLeft ) {
      nextScrollX = ( nextScrollX - ( maxStep * 0.05 ) );

    // Should we scroll right?
    } else if ( isInRightEdge && canScrollRight ) {
      nextScrollX = ( nextScrollX + ( maxStep * 0.05 ) );
    }
    // Should we scroll up?
    if ( isInTopEdge && canScrollUp ) {
      nextScrollY = ( nextScrollY - ( maxStep * 0.05 ) );

    // Should we scroll down?
    } else if ( isInBottomEdge && canScrollDown ) {
      nextScrollY = ( nextScrollY + ( maxStep * 0.05 ) );
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
    let currentFood = allFood[i].getObject().getBoundingClientRect();
    if ((playerPos.x < (currentFood.x+5)) && (playerPos.x > (currentFood.x-75)) && (playerPos.y <(currentFood.y+5) && playerPos.y > (currentFood.y-75))){
      console.log("EAT");
      allFood[i].removeObject();
      allFood.splice(i, 1);
      player.eat();
      break;
    }
  }
  //console.log("Food x: " + foodPos.x + " Food y: " + foodPos.y);
  //console.log("Player x: " + playerPos.x + " Player y: " + playerPos.y);
//  console.log("Mouse x: " + x + " Mouse y: " + y);
}
loadPlayer();
loadFood(100);
console.log(allFood);
console.log(player);
setInterval(checkEat, 500);
