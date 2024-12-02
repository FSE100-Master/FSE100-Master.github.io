let puzzles = [
  { letters: ['A', 'P', 'L', 'E'], words: ['APPLE', 'PAL', 'LEAP'] },
  { letters: ['B', 'A', 'T', 'E'], words: ['BATE', 'BAT', 'TAB'] },
  { letters: ['C', 'A', 'T', 'S'], words: ['CATS', 'CAT', 'ACT', 'SAT'] }
];

let currentPuzzleIndex = 0;
let letters = [];
let puzzleWords = [];
let bonusWords = [];
let selectedWord = "";
let usedWords = [];
let coins = 0;

function setup() {
  const canvas = createCanvas(800, 500);
  canvas.parent('game-container'); // Attach the canvas to the game container

  textSize(24);
  textAlign(CENTER, CENTER);
  setupPuzzle();

  // Create the Next Puzzle button
  const nextButton = createButton('Next Puzzle');
  nextButton.position(width / 2 - 50, height - 80);
  nextButton.mousePressed(nextPuzzle);
  nextButton.style('font-size', '16px');
  nextButton.style('background-color', '#ffcc00');
  nextButton.style('border', 'none');
  nextButton.style('padding', '10px 20px');
  nextButton.style('border-radius', '5px');
  nextButton.parent('game-container'); // Attach the button to the container
}

function setupPuzzle() {
  let puzzle = puzzles[currentPuzzleIndex];
  letters = puzzle.letters;
  puzzleWords = puzzle.words;
  bonusWords = [];
  selectedWord = "";
  usedWords = [];
}

function draw() {
  background(30, 144, 255); // Nice blue background

  // Title
  fill(255);
  textSize(32);
  text("Wordscapes", width / 2, 40);

  // Draw letters
  for (let i = 0; i < letters.length; i++) {
    let x = width / 2 - 50 * (letters.length - 1) + i * 100;
    let y = height / 2;
    drawLetter(letters[i], x, y);
  }

  // Display selected word
  fill(255);
  textSize(24);
  text("Selected Word: " + selectedWord, width / 2, height / 2 + 100);

  // Display found words
  textSize(18);
  text("Found Words: " + usedWords.join(", "), width / 2, height / 2 + 150);

  // Display coins
  textSize(24);
  text("Coins: " + coins, 100, 50);
}

function drawLetter(letter, x, y) {
  fill(255, 165, 0); // Orange background for letters
  ellipse(x, y, 80, 80);
  fill(0);
  textSize(32);
  text(letter, x, y);
}

function mousePressed() {
  for (let i = 0; i < letters.length; i++) {
    let x = width / 2 - 50 * (letters.length - 1) + i * 100;
    let y = height / 2;

    if (dist(mouseX, mouseY, x, y) < 40) {
      selectedWord += letters[i]; // Add letter to the selected word
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    checkWord(selectedWord);
    selectedWord = ""; // Reset selected word
  } else if (keyCode === BACKSPACE) {
    selectedWord = selectedWord.slice(0, -1); // Remove the last letter
  }
}

function checkWord(word) {
  if (usedWords.includes(word)) {
    alert("You've already found this word!");
    return;
  }

  if (puzzleWords.includes(word)) {
    alert(`Correct! ${word} is in the puzzle!`);
    usedWords.push(word);
    coins += 10; // Reward for finding a valid word
  } else if (isBonusWord(word)) {
    alert(`Bonus Word! You earned 5 coins for finding ${word}`);
    bonusWords.push(word);
    coins += 5;
  } else {
    alert(`Sorry, ${word} is not valid.`);
  }
}

function isBonusWord(word) {
  return word.length >= 3 && !puzzleWords.includes(word) && !bonusWords.includes(word);
}

function nextPuzzle() {
  if (currentPuzzleIndex < puzzles.length - 1) {
    currentPuzzleIndex++;
    setupPuzzle();
  } else {
    alert("Congratulations! You've completed all puzzles!");
    noLoop(); // Stop the game
  }
}

