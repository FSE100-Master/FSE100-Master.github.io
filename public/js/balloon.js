let balloons = [];
let targetNumber;
let score = 0;
let timer = 120; // 2 minutes in seconds

function setup() {
  const canvas = createCanvas(windowWidth * .85, windowHeight * .85);
  canvas.class('center-canvas');
  generateTargetNumber();
  frameRate(60); // 60 frames per second
}

function windowResized() {
  resizeCanvas(windowWidth * .85, windowHeight * .85);
}

function draw() {
  background(135, 206, 235);
  displayTimer();
  displayScore();
  displayTargetNumber();

  // Create new balloons every second
  if (frameCount % 60 === 0) {
    // Higher chance for target number balloons
    let randomNumber = random();
    let balloonNumber = randomNumber < 0.5 ? targetNumber : floor(random(1, 10));
    balloons.push(new Balloon(random(20, width - 20), -40, balloonNumber));
  }

  // Update and display balloons
  for (let i = balloons.length - 1; i >= 0; i--) {
    balloons[i].move();
    balloons[i].display();

    if (balloons[i].y > height + 40) {
      balloons.splice(i, 1); // Remove balloons that go off-screen
    }
  }

  // Game over condition
  if (timer <= 0) {
    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    noLoop(); // Stop the game loop
  }
}

function mousePressed() {
  for (let i = balloons.length - 1; i >= 0; i--) {
    if (balloons[i].isClicked(mouseX, mouseY)) {
      if (balloons[i].number === targetNumber) {
        score += 10;
        timer += 2; // Add 2 seconds for correct tap
        generateTargetNumber();
      } else {
        score -= 5;
        timer -= 5; // Subtract 5 seconds for incorrect tap
      }
      balloons.splice(i, 1); // Remove tapped balloon
      break;
    }
  }
}

function displayTimer() {
  textSize(20);
  fill(0);
  textAlign(LEFT);
  text("Time: " + max(0, timer) + "s", 10, 30);

  // Decrease timer every second
  if (frameCount % 60 === 0 && timer > 0) {
    timer--;
  }
}

function displayScore() {
  textSize(20);
  fill(0);
  textAlign(RIGHT);
  text("Score: " + score, width - 10, 30);
}

function displayTargetNumber() {
  textSize(24);
  fill(0);
  textAlign(CENTER);
  text("Tap Number: " + targetNumber, width / 2, 50);
}

function generateTargetNumber() {
  targetNumber = floor(random(1, 10));
  // Ensure there is always one balloon with the target number
  balloons.push(new Balloon(random(20, width - 20), -40, targetNumber));
}

// Balloon class
class Balloon {
  constructor(x, y, number) {
    this.x = x;
    this.y = y;
    this.number = number;
    this.speed = random(1, 3);
    this.size = 60;
  }

  move() {
    this.y += this.speed;
  }

  display() {
    fill(255, 100, 150);
    ellipse(this.x, this.y, this.size, this.size + 10);
    fill(255);
    textSize(25);
    textAlign(CENTER, CENTER);
    text(this.number, this.x, this.y);
  }

  isClicked(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.size / 2;
  }
}