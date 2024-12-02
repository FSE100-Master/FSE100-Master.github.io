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
    // Create the canvas and attach it to the 'gameArea' div
    const canvas = createCanvas(800, 600);
    canvas.parent('gameArea');

    // Create shapes for tracing
    createShapes();

    // Get the color picker element
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('change', () => {
        tracerColor = getColorFromName(colorPicker.value);
        colorSelected = true;
    });
}

function getColorFromName(colorName) {
    const colors = {
        red: [255, 0, 0],
        darkred: [139, 0, 0],
        blue: [0, 0, 255],
        darkblue: [0, 0, 139],
        purple: [128, 0, 128],
        darkgreen: [0, 100, 0],
        pink: [255, 105, 180],
        yellow: [255, 255, 0],
    };
    return colors[colorName] || [0, 0, 255]; // Default to blue
}

function createShapes() {
    shapes.push(new CircleShape(width / 2, height / 2, 150)); // Level 1: Circle
    shapes.push(new RectangleShape(width / 2 - 100, height / 2 - 50, 200, 100)); // Level 2: Rectangle
    shapes.push(new TriangleShape(width / 2 - 100, height / 2 + 50, 100, 200)); // Level 3: Triangle
}

function draw() {
    if (!colorSelected) return; // Wait until the user selects a color

    background(255, 248, 220); // Weathered paper background

    if (currentLevel < shapes.length) {
        let shapeToTrace = shapes[currentLevel];
        shapeToTrace.display();

        // Draw the player's tracing path
        noFill();
        stroke(tracerColor);
        strokeWeight(6);
        beginShape();
        for (let p of tracePath) {
            vertex(p.x, p.y);
        }
        endShape();

        // Check if the trace is complete
        if (!levelComplete && tracePath.length > 0 && shapeToTrace.isTraced(tracePath)) {
            levelComplete = true;
            levelCompleteTime = millis();
            greatJobStartTime = levelCompleteTime + 1000; // Delay for "Great Job!" to appear
        }

        if (levelComplete && millis() > greatJobStartTime) {
            showGreatJob = true;
        }

        if (showGreatJob) {
            textSize(32);
            fill(0, 200, 0); // Green for "Great Job!" text fill
            stroke(0, 128, 0); // Dark Green for "Great Job!" border
            strokeWeight(4);
            textAlign(CENTER, TOP);
            text("Great Job!", width / 2, 20); // Display at the top middle
        }

        // Proceed to the next level after a delay
        if (levelComplete && millis() - levelCompleteTime > 5000) {
            currentLevel++;
            if (currentLevel >= shapes.length) {
                noLoop(); // End the game if all levels are complete
            } else {
                tracePath = []; // Clear the trace path for the next level
                levelComplete = false;
                showGreatJob = false; // Reset for the next level
            }
        }
    } else {
        // Final screen after completing all levels
        background(255, 223, 186); // Trophy background
        textSize(32);
        fill(0, 0, 200);
        textAlign(CENTER, CENTER);
        text("Congratulations! You completed all levels!", width / 2, height / 2 - 150);
        drawTrophy(width / 2, height / 2); // Draw the fully coded trophy
    }
}

function mousePressed() {
    tracePath = [];
}

function mouseDragged() {
    tracePath.push(createVector(mouseX, mouseY));
}

function drawTrophy(x, y) {
    fill(184, 134, 11); // Golden color
    noStroke();
    rectMode(CENTER);
    rect(x, y + 50, 100, 20); // Base of the trophy
    rect(x, y + 65, 80, 20); // Handle part
    ellipse(x, y - 50, 150, 100); // Trophy cup part
    rect(x, y, 50, 100); // Trophy stem
    // Trophy handles
    ellipse(x - 80, y - 50, 50, 100);
    ellipse(x + 80, y - 50, 50, 100);
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
        stroke(0); // Changed line color to black
        strokeWeight(2);
        drawingContext.setLineDash([5
::contentReference[oaicite:0]{index=0}
 
