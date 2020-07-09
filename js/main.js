import {Player} from './player.js';

console.log(window.innerWidth);
console.log(window.innerHeight);
let circle = document.querySelector(".circle");
let food = document.querySelector(".food");
let x, y, size = 1;

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

function checkEat(){
  let playerPos = circle.getBoundingClientRect();
  let foodPos = food.getBoundingClientRect();
  if ((playerPos.x < (foodPos.x+5)) && (playerPos.x > (foodPos.x-75)) && (playerPos.y <(foodPos.y+5) && playerPos.y > (foodPos.y-75))){
    console.log("EAT");
    food.style.visibility = "hidden";
    size += 0.1;
  }
  circle.style.transform = `translate(${x}px, ${y}px) scale(${size})`;
  //console.log("Food x: " + foodPos.x + " Food y: " + foodPos.y);
  //console.log("Player x: " + playerPos.x + " Player y: " + playerPos.y);
//  console.log("Mouse x: " + x + " Mouse y: " + y);
}

setInterval(checkEat, 500);
