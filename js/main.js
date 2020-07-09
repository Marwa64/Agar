
let circle = document.querySelector(".circle");
let food = document.querySelector(".food");
let x, y, size = 1;
document.addEventListener('mousemove', () => {
  x = event.clientX - 50;
  y = event.clientY - 55;
  circle.style.transform = `translate(${x}px, ${y}px) scale(${size})`;
})

function checkEat(){
  let playerPos = circle.getBoundingClientRect();
  let foodPos = food.getBoundingClientRect();
  if ((playerPos.x < (foodPos.x+5)) && (playerPos.x > (foodPos.x-75)) && (playerPos.y <(foodPos.y+5) && playerPos.y > (foodPos.y-75))){
    console.log("EAT");
    food.style.visibility = "hidden";
    size += 0.1;
  }
  //console.log("Food x: " + foodPos.x + " Food y: " + foodPos.y);
  //console.log("Player x: " + playerPos.x + " Player y: " + playerPos.y);
}

setInterval(checkEat, 500);
