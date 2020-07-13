export class Player{
  constructor(id){
    this.id = id;
    this.size = 1;
    this.speed = 1; // transition speed
    this.count = 0;
    this.toggle = false;
  }
  createObject(x,y){
    this.circle = document.createElement("div");
    this.circle.classList.add("circle");
    this.circle.style.transform = `translate(${x}px, ${y}px)`;
    document.body.querySelector("#players").appendChild(this.circle);
  }
  setName(name){
    this.circle.innerHTML = `<span class="name"> ${name} </span>`;
  }
  removeObject(){
    this.circle.remove();
  }
  eat(){
    if (this.count === 6){
      if (this.size < 9.1){
        this.size += 0.2;
      }
      let val = Math.floor(this.size * 10);
      if (val % 5 === 0 && this.speed < 5){
        this.speed += 1;
      }
      this.circle.style.transitionDuration = `${this.speed}s`;
      this.count = 0;
      this.toggle = true;
    } else {
      this.count++;
      this.toggle = false;
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
