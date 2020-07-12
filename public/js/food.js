export class Food{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  createObject = () => {
    this.circle = document.createElement("div");
    this.circle.classList.add("food");
    this.circle.style.transform = `translate(${this.x}px, ${this.y}px)`;
    document.body.querySelector("#food").appendChild(this.circle);
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
  removeObject(){
    this.circle.style.visibility = "hidden";
  }
  getObject = () => {
    return this.circle;
  }
  getX(){
    return this.x;
  }
  getY(){
    return this.y;
  }
}
