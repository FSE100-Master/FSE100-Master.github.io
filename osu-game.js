let score = 0;
let timeLeft = 30;
let gameActive = true;

const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timerDisplay'); 


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function createCircle() {
    if (!gameActive) return;

    const circle = document.createElement('div');
    circle.classList.add('circle');


    circle.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    circle.style.top = Math.random() * (gameArea.offsetHeight - 50) + 'px';


    circle.style.backgroundColor = getRandomColor();


    circle.onclick = function () {
        score++;
        scoreDisplay.textContent = score;
        gameArea.removeChild(circle);
        createCircle();
    };

    gameArea.appendChild(circle);

    setTimeout(() => {
        if (gameArea.contains(circle)) {
            gameArea.removeChild(circle);
            if (gameActive) createCircle();
        }
    }, 1000);
}


function startTimer() {
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    timerDisplay.textContent = "Time's up!";
    alert(`Game Over! Your score is: ${score}`);
}


startTimer();
createCircle();
