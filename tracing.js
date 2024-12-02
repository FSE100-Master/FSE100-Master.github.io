let shapes = []; // Stores shapes for each level
let currentLevel = 0; // Current level
let tracePath = []; // Stores the player's tracing points
let maxDistance = 10; // Max allowable distance from the shape path
let levelComplete = false; // Indicates if the level is complete
let levelCompleteTime = 0; // Time when the level was completed
let showGreatJob = false; // Tracks whether to display "Great Job!"
let greatJobStartTime = 0; // When "Great Job!" starts showing
let tracerColor = [0, 0, 255]; // Default color is blue
let colorSelected = false; // To track if the color has been selected

function setup() {
    createCanvas(800, 600);
    createShapes();

    // Get the color picker element
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('change', () => {
        tracerColor = getColorFromName(colorPicker.value);
        colorSelected = true;
    });
}

function getColorFromName(colorName) {
    switch (colorName) {
        case 'red': return [255, 0, 0];
        case 'darkred': return [139, 0, 0];
        case 'blue': return [0, 0, 255];
        case 'purple': return [128, 0, 128];
        case 'darkgreen': return [0, 100, 0];
        case 'pink': return [255, 105, 180];
        case 'yellow': return [255, 255, 0];
        default: return [0, 0, 255]; // Default to blue
    }
}

function createShapes() {
    shapes.push(new CircleShape(width / 2, height / 2, 150)); // Level 1: Circle
    shapes.push(new RectangleShape(width / 2 - 100, height / 2 - 50, 200, 100)); // Level 2: Rectangle
    shapes.push(new TriangleShape(width / 2 - 100, height / 2 + 50, 100, 200)); // Level 3: Triangle
}

function draw() {
    if (!colorSelected) return; // Wait until the user selects a color

    drawWeatheredPaperBackground();

    if (currentLevel < shapes.length) {
        let shapeToTrace = shapes[currentLevel];
        shapeToTrace.display();

        noFill();
        stroke(tracerColor);
        strokeWeight(6);
        beginShape();
        for (let p of tracePath) {
            vertex(p.x, p.y);
        }
        endShape();

        if (!levelComplete && tracePath.length > 0 && shapeToTrace.isTraced(tracePath)) {
            levelComplete = true;
            levelCompleteTime = millis();
            greatJobStartTime = levelCompleteTime + 1000;
        }

        if (levelComplete && millis() > greatJobStartTime) {
            showGreatJob = true;
        }

        if (showGreatJob) {
            textSize(32);
            fill(0, 200, 0);
            stroke(0, 128, 0);
            strokeWeight(4);
            textAlign(CENTER, TOP);
            text("Great Job!", width / 2, 20);
        }

        if (levelComplete && millis() - levelCompleteTime > 3000) {
            currentLevel++;
            if (currentLevel >= shapes.length) {
                noLoop();
            } else {
                tracePath = [];
                levelComplete = false;
                showGreatJob = false;
            }
        }
    } else {
        background(255, 223, 186);
        textSize(32);
        fill(0, 0, 200);
        textAlign(CENTER, CENTER);
        text("Congratulations! You completed all levels!", width / 2, height / 2);
    }
}

function mousePressed() {
    tracePath = [];
}

function mouseDragged() {
    tracePath.push(createVector(mouseX, mouseY));
}

function drawWeatheredPaperBackground() {
    background(255, 248, 220);
    stroke(240, 200, 150, 150);
    for (let y = 40; y < height; y += 40) {
        line(0, y, width, y);
    }
}

class Shape {
    isTracedCompletely(tracePath, shapePoints) {
        let matchedPoints = new Set();
        for (let p of tracePath) {
            for (let i = 0; i < shapePoints.length; i++) {
                let sp = shapePoints[i];
                if (dist(p.x, p.y, sp.x, sp.y) <= maxDistance) {
                    matchedPoints.add(i);
                }
            }
        }
        return matchedPoints.size === shapePoints.length;
    }
}

class CircleShape extends Shape {
    constructor(x, y, radius) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    display() {
        noFill();
        stroke(0);
        strokeWeight(2);
        ellipse(this.x, this.y, this.radius * 2);
    }

    isTraced(tracePath) {
        let shapePoints = [];
        for (let angle = 0; angle < TWO_PI; angle += 0.05) {
            let x = this.x + cos(angle) * this.radius;
            let y = this.y + sin(angle) * this.radius;
            shapePoints.push(createVector(x, y));
        }
        return this.isTracedCompletely(tracePath, shapePoints);
    }
}

class RectangleShape extends Shape {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    display() {
        noFill();
        stroke(0);
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.height);
    }

    isTraced(tracePath) {
        let shapePoints = [];
        for (let i = 0; i <= this.width; i += 5) {
            shapePoints.push(createVector(this.x + i, this.y));
            shapePoints.push(createVector(this.x + i, this.y + this.height));
        }
        for (let i = 0; i <= this.height; i += 5) {
            shapePoints.push(createVector(this.x, this.y + i));
            shapePoints.push(createVector(this.x + this.width, this.y + i));
        }
        return this.isTracedCompletely(tracePath, shapePoints);
    }
}
