export class Player{
  constructor(id){
    this.id = id;
    this.size = 1;
    this.speed = 1; // transition speed
    this.toggle = true;
  }
  createObject(x,y){
    this.circle = document.createElement("div");
    this.circle.classList.add("circle");
    this.circle.style.transform = `translate(${x}px, ${y}px)`;
    document.body.querySelector("#players").appendChild(this.circle);
  }
  removeObject(){
    this.circle.remove();
  }
  eat(){
    if (this.size < 9.1){
      this.size += 0.2;
    }
    if (this.toggle === true){
      let val = Math.floor(this.size * 10);
      if (val % 5 === 0 && this.speed < 5){
        this.speed += 1;
      }
      this.circle.style.transitionDuration = `${this.speed}s`;
      this.toggle = false;
    } else {
      this.toggle = true;
    }
    return this.toggle;
  }
  kill(enemySize){
    this.size += enemySize / 2;
  }
  move(x,y){
    this.circle.style.transform = `translate(${x}px, ${y}px) scale(${this.size})`;
  }
  getSize(){
    return this.size;
  }
  getID(){
    return this.id;
  }
  getObject(){
    return this.circle;
  }
  setSize(size){
    this.size = size;
  }
  setSpeed(speed){
    this.speed = speed;
    this.circle.style.transitionDuration = `${this.speed}s`;
  }
}
