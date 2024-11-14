// Initialize variables
let score = 0;
let gameArea = document.getElementById('gameArea');
let scoreDisplay = document.getElementById('score');


function createCircle() {
    let circle = document.createElement('div');
    circle.classList.add('circle');

    circle.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    circle.style.top = Math.random() * (gameArea.offsetHeight - 50) + 'px';


    circle.onclick = function() {
        score++;
        scoreDisplay.textContent = score;
        gameArea.removeChild(circle); 
        createCircle();
    };

    gameArea.appendChild(circle);

 
    setTimeout(() => {
        if (gameArea.contains(circle)) {
            gameArea.removeChild(circle);
            createCircle(); 
        }
    }, 1000); 
}

createCircle();
