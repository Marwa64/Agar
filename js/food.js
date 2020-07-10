export class Food{
  constructor(){
    this.x = Math.floor(Math.random() * 1900) + 20;
    this.y = Math.floor(Math.random() * 1900) ;
  }
  createObject(){
    this.circle = document.createElement("div");
    this.circle.classList.add("food");
    this.circle.style.transform = `translate(${this.x}px, ${this.y}px)`;
    document.body.appendChild(this.circle);
  }
  removeObject(){
    this.circle.remove();
  }
  getObject(){
    return this.circle;
  }
}
