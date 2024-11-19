let balloons = [];
let clouds = [];
let targetNumber;
let score = 0;
let timer = 120; // 2 minutes in seconds

function setup() {
  const canvas = createCanvas(windowWidth * 0.85, windowHeight * 0.85);
  canvas.class('center-canvas');
  generateTargetNumber();
  frameRate(60); // 60 frames per second

  // Create initial clouds
  for (let i = 0; i < 5; i++) {
    clouds.push(new Cloud(random(width), random(height / 4), random(100, 200)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth * 0.85, windowHeight * 0.85);
}

function draw() {
  background(135, 206, 235);
  
  // Display clouds
  for (let cloud of clouds) {
    cloud.move();
    cloud.display();
  }

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
    this.color = color(random(255), random(255), random(255)); // Random color
  }

  move() {
    this.y += this.speed;
  }

  display() {
    fill(this.color);
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

// Cloud class
class Cloud {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = random(0.5, 1.5); // Random speed for the cloud
  }

  move() {
    this.x += this.speed; // Move the cloud to the right
    if (this.x > width + this.size) {
      this.x = -this.size; // Reset position to the left if it goes off-screen
    }
  }

  display() {
    fill(255); // White color for the cloud
    noStroke();
    ellipse(this.x, this.y, this.size, this.size / 2); // Main body of the cloud
    ellipse(this.x - this.size / 4, this.y, this.size / 1.5, this.size / 3); // Left puff
    ellipse(this.x + this.size / 4, this.y, this.size / 1.5, this.size / 3); // Right puff
  }
}