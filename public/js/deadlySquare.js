export class DeadlySquare{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  createObject = () => {
    this.square = document.createElement("div");
    this.square.classList.add("square");
    this.square.style.transform = `translate(${this.x}px, ${this.y}px)`;
    document.body.querySelector("#squares").appendChild(this.square);
  }
  checkCollision = (right,left,top,bottom) => {
    let currentSquare = this.square.getBoundingClientRect();
    if (right > currentSquare.left && left < currentSquare.right && bottom > currentSquare.top && top < currentSquare.bottom){
      console.log("DIE");
      return true;
    } else {
      return false;
    }
  }
  getObject = () => {
    return this.square;
  }
  getX(){
    return this.x;
  }
  getY(){
    return this.y;
  }
}
