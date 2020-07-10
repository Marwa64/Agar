export class Player{
  constructor(){
    this.size = 1;
    this.speed = 2; // transition speed
  }
  createObject(x,y){
    this.circle = document.createElement("div");
    this.circle.classList.add("circle");
    this.circle.style.transform = `translate(${x}px, ${y}px)`;
    document.body.appendChild(this.circle);
  }
  removeObject(){
    this.circle.remove();
  }
  eat(){
    this.size += 0.1;
    let val = this.size * 10;
    if (val % 5 === 0){
      this.speed++;
    }
    //this.circle.style.transitionDuration = `${this.speed}s`;
  }
  move(x,y){
    this.circle.style.transform = `translate(${x}px, ${y}px) scale(${this.size})`;
  }
  getObject(){
    return this.circle;
  }
}
