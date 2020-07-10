export class Food{
  constructor(){
    this.x = Math.floor(Math.random() * 2400);
    this.y = Math.floor(Math.random() * 1500) ;
  }
  createObject = () => {
    this.circle = document.createElement("div");
    this.circle.classList.add("food");
    this.circle.style.transform = `translate(${this.x}px, ${this.y}px)`;
    document.body.appendChild(this.circle);
  }
  checkCollision = (x,y, size) => {
    let currentFood = this.circle.getBoundingClientRect();
    //console.log("Food x: " + currentFood.x + " Food y: " + currentFood.y);
    //console.log("Player x: " +x + " Player y: " + y);
    if ((x < (currentFood.x+5)) && (x > (currentFood.x-(75 + (size-1)*100 ) )) && (y < (currentFood.y+5) && y > (currentFood.y-(75 + (size-1)*100 ) ) )){
      console.log("EAT");
      this.circle.style.visibility = "hidden";
      return true;
    } else {
      return false;
    }
  }
  getObject = () => {
    return this.circle;
  }
}
