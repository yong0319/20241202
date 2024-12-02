let message = "我都有做作業想怎樣";
let currentText = "";
let currentIndex = 0;
let particles = [];
let flames = [];
let isComplete = false;
let textAlpha = 255;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(windowHeight/10);
  frameRate(3);
}

function draw() {
  background(176, 196, 222);
  
  // 更新和顯示火焰粒子
  if (frameCount % 2 == 0) { // 控制火焰產生速度
    createFlames();
  }
  
  for (let i = flames.length - 1; i >= 0; i--) {
    flames[i].update();
    flames[i].show();
    if (flames[i].isDead()) {
      flames.splice(i, 1);
    }
  }
  
  // 更新和顯示文字煙火粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  // 逐字顯示文字
  if (currentIndex < message.length) {
    currentText = message.substring(0, currentIndex + 1);
    createFirework(currentIndex);
    currentIndex++;
    if (currentIndex === message.length) {
      isComplete = true;
    }
  }

  // 文字完整顯示後的閃爍效果
  if (isComplete) {
    textAlpha = sin(frameCount * 0.1) * 127 + 128;
  }

  // 顯示米黃色文字
  fill(245, 245, 220, textAlpha);
  text(currentText, width/2, height/2);
}

function createFlames() {
  // 在文字下方產生火焰
  let totalWidth = textWidth(message);
  let startX = width/2 - totalWidth/2;
  let endX = width/2 + totalWidth/2;
  
  for (let x = startX; x < endX; x += 20) {
    let flame = new Flame(x, height/2 + 30);
    flames.push(flame);
  }
}

class Flame {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-5, -2));
    this.acc = createVector(0, -0.1);
    this.life = 255;
    this.size = random(10, 20);
    
    // 火焰顏色漸層
    let colors = [
      color(255, 0, 0),    // 紅
      color(255, 69, 0),   // 橙紅
      color(255, 140, 0),  // 深橙
      color(255, 215, 0)   // 金黃
    ];
    this.color = random(colors);
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.life -= 5;
    this.size *= 0.95;
  }
  
  show() {
    if (this.life > 0) {
      noStroke();
      let c = color(red(this.color), green(this.color), blue(this.color), this.life);
      fill(c);
      
      // 繪製火焰形狀
      push();
      translate(this.pos.x, this.pos.y);
      beginShape();
      for (let i = 0; i < TWO_PI; i += 0.2) {
        let xoff = map(cos(i), -1, 1, 0, 0.5);
        let yoff = map(sin(i), -1, 1, 0, 0.5);
        let r = this.size * noise(xoff, yoff, frameCount * 0.05);
        let x = r * cos(i);
        let y = r * sin(i);
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
    }
  }
  
  isDead() {
    return this.life <= 0;
  }
}

function createFirework(index) {
  let totalWidth = textWidth(message);
  let x = width/2 - totalWidth/2 + textWidth(message.substring(0, index)) + textWidth(message.charAt(index))/2;
  let y = height/2;
  
  for (let i = 0; i < 30; i++) {
    let particle = new Particle(x, y);
    particles.push(particle);
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 8));
    this.acc = createVector(0, 0.2);
    this.life = 255;
    this.color = color(245, 245, 220, this.life);
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.life -= 10;
  }
  
  show() {
    if (this.life > 0) {
      stroke(red(this.color), green(this.color), blue(this.color), this.life);
      strokeWeight(4);
      point(this.pos.x, this.pos.y);
    }
  }
  
  isDead() {
    return this.life <= 0;
  }
}

function mousePressed() {
  currentText = "";
  currentIndex = 0;
  particles = [];
  flames = [];
  isComplete = false;
  textAlpha = 255;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  textSize(windowHeight/10);
} 