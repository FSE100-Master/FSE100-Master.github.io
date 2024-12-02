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
let colorSelect; // To store the color selection element 

function setup() { 
    createCanvas(800, 600); 
    let colors = ['red', 'darkred', 'blue', 'darkblue', 'purple', 'darkgreen', 'pink', 'yellow']; 
    colorSelect = createSelect(); 
    colors.forEach(color => colorSelect.option(color)); 
    colorSelect.position(100, 500); 
    colorSelect.changed(() => { 
        tracerColor = getColorFromName(colorSelect.value()); 
        colorSelected = true; // Mark color as selected 
        colorSelect.remove(); // Remove the color selection after it has been made 
        createShapes(); // Create shapes after the color is selected 
    }); 
} 

function getColorFromName(colorName) { 
    switch(colorName) { 
        case 'red': return [255, 0, 0]; 
        case 'darkred': return [139, 0, 0]; 
        case 'blue': return [0, 0, 255]; 
        case 'darkblue': return [0, 0, 139]; 
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
    shapes.push(new CircleShape(width / 2, height / 2, 200)); // Level 4: Larger Circle 
    shapes.push(new RectangleShape(width / 2 - 150, height / 2 - 75, 300, 150)); // Level 5: Large Rectangle 
} 

function draw() { 
    if (!colorSelected) return; // Wait until the user selects a color 
    drawWeatheredPaperBackground(); 
    if (currentLevel < shapes.length) { // Display the shape to trace 
        let shapeToTrace = shapes[currentLevel]; 
        shapeToTrace.display(); // Draw the shape 
        noFill(); 
        stroke(tracerColor); 
        strokeWeight(6); 
        beginShape(); 
        for (let p of tracePath) { 
            vertex(p.x, p.y); 
        } 
        endShape(); 

        // Check if the trace is complete with 100% accuracy 
        if (!levelComplete && tracePath.length > 0 && shapeToTrace.isTraced(tracePath)) { 
            levelComplete = true; 
            levelCompleteTime = millis(); // Record the completion time 
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

        textSize(20); 
        fill(0); 
        textAlign(LEFT, BOTTOM); 
        text(`Level: ${currentLevel + 1}`, 10, height - 10); 
        drawArrow(); 

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
    } else { // Final screen after completing all levels 
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

function drawArrow() { 
    fill(0); 
    noStroke(); 
    beginShape(); 
    vertex(20, 20); // Arrow tip 
    vertex(20, 40); 
    vertex(0, 30); // Adjusted to make the arrow point left 
    vertex(20, 20); 
    endShape(CLOSE); 
} 

function drawWeatheredPaperBackground() { 
    background(255, 248, 220); // Off-white/yellowish tone for weathered paper 
    stroke(240, 200, 150, 150); // Light brownish lines for texture 
    for (let y = 40; y < height; y += 40) { 
        line(0, y, width, y); // Horizontal lines 
    } 
    stroke(200, 100, 50, 150); // Darker brown margin line 
    line(60, 0, 60, height); // Vertical margin 
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
        drawingContext.setLineDash([5, 15]); // Dotted lines 
        ellipse(this.x, this.y, this.radius * 2); 
        drawingContext.setLineDash([]); // Reset to solid lines 
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
        stroke(0); // Changed line color to black 
        strokeWeight(2); 
        drawingContext.setLineDash([5, 15]); // Dotted lines 
        rect(this.x, this.y, this.width, this.height); 
        drawingContext.setLineDash([]); // Reset to solid lines 
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

class TriangleShape extends Shape { 
    constructor(x, y, base, height) { 
        super(); 
        this.x = x; 
        this.y = y; 
        this.base = base; 
        this.height = height; 
    } 
    display() { 
        noFill(); 
        stroke(0); // Changed line color to black 
        strokeWeight(2); 
        drawingContext.setLineDash([5, 15]); // Dotted lines 
        triangle(this.x, this.y, this.x + this.base / 2, this.y - this.height, this.x + this.base, this.y); 
        drawingContext.setLineDash([]); // Reset to solid lines 
    } 
    isTraced(tracePath) { 
        let shapePoints = []; 
        let x1 = this.x; 
        let y1 = this.y; 
        let x2 = this.x + this.base / 2; 
        let y2 = this.y - this.height; 
        let x3 = this.x + this.base; 
        let y3 = this.y; 
        for (let t = 0; t <= 1; t += 0.05) { 
            shapePoints.push(createVector(lerp(x1, x2, t), lerp(y1, y2, t))); 
            shapePoints.push(createVector(lerp(x2, x3, t), lerp(y2, y3, t))); 
            shapePoints.push(createVector(lerp(x3, x1, t), lerp(y3, y1, t))); 
        } 
        return this.isTracedCompletely(tracePath, shapePoints); 
    } 
} 