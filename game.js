window.addEventListener('load', startGame);

let startTime;
let meteorInterval;
let timerInterval;
let speedIncreaseInterval;
let meteorSpeed = 10;
let meteors = [];

function startGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.style.position = 'relative';
    gameArea.style.width = '100%';
    gameArea.style.height = '100vh';
    gameArea.style.backgroundImage = 'url("img/images.png")';
    gameArea.style.backgroundSize = 'auto';
    gameArea.style.backgroundRepeat = 'repeat';

    const player = document.createElement('img');
    player.id = 'player';
    player.src = 'img/adam2.jpg'; // Use adam2.jpg for the player
    player.classList.add('spinning'); // Add spinning class
    player.style.position = 'absolute';
    player.style.width = '100px'; // Increase size for better usability
    player.style.height = 'auto'; // Maintain aspect ratio
    player.style.top = '50%';
    player.style.left = '50%';
    player.style.transform = 'translate(-50%, -50%)'; // Center the player
    gameArea.appendChild(player);

    const hitbox = document.createElement('div');
    hitbox.id = 'hitbox';
    hitbox.style.position = 'absolute';
    hitbox.style.width = '20px'; // Small hitbox size
    hitbox.style.height = '20px';
    hitbox.style.backgroundColor = 'transparent'; // Invisible hitbox
    hitbox.style.top = '50%';
    hitbox.style.left = '50%';
    hitbox.style.transform = 'translate(-50%, -50%)'; // Center the hitbox
    gameArea.appendChild(hitbox);

    const timer = document.createElement('div');
    timer.id = 'timer';
    timer.style.position = 'absolute';
    timer.style.top = '10px';
    timer.style.left = '10px';
    timer.style.color = 'white';
    timer.style.fontSize = '40px'; // Increase size for better usability
    timer.style.textShadow = '0px 0px 10px rgb(166, 0, 255)';
    timer.style.fontFamily = 'pixel';
    gameArea.appendChild(timer);

    gameArea.addEventListener('mousemove', movePlayerWithMouse);
    document.addEventListener('keydown', handleKeyPress);
    startTime = new Date();
    meteorInterval = setInterval(createMeteor, 500); // Create meteors more frequently
    timerInterval = setInterval(updateTimer, 10); // Update timer every 10 milliseconds
    speedIncreaseInterval = setInterval(increaseMeteorSpeed, 5000); // Increase meteor speed every 5 seconds
}

function movePlayerWithMouse(event) {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    const hitbox = document.getElementById('hitbox');
    const rect = gameArea.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    player.style.left = `${mouseX}px`;
    player.style.top = `${mouseY}px`;
    hitbox.style.left = `${mouseX}px`;
    hitbox.style.top = `${mouseY}px`;
}

function updateTimer() {
    const timer = document.getElementById('timer');
    const currentTime = new Date();
    const timeElapsed = ((currentTime - startTime) / 1000).toFixed(3);
    timer.innerText = `Time: ${timeElapsed} seconds`;
}

function createMeteor() {
    const gameArea = document.getElementById('gameArea');
    const meteor = document.createElement('img');
    meteor.className = 'meteor';
    meteor.src = 'img/meteor.png';
    meteor.style.position = 'absolute';
    meteor.style.width = Math.random() < 0.2 ? '60px' : '40px'; // 20% chance to create a larger meteor
    meteor.style.height = 'auto';
    meteor.style.top = Math.random() * gameArea.clientHeight + 'px';
    meteor.style.left = gameArea.clientWidth + 'px';
    gameArea.appendChild(meteor);
    meteors.push(meteor);

    moveMeteor(meteor);
}

function moveMeteor(meteor) {
    const gameArea = document.getElementById('gameArea');
    const interval = setInterval(() => {
        let left = parseInt(meteor.style.left);
        if (left < -meteor.clientWidth) {
            clearInterval(interval);
            meteor.remove();
            meteors = meteors.filter(m => m !== meteor);
        } else {
            meteor.style.left = (left - meteorSpeed) + 'px'; // Move meteor from right to left
        }

        // Check for collision with hitbox
        const hitbox = document.getElementById('hitbox');
        const hitboxRect = hitbox.getBoundingClientRect();
        const meteorRect = meteor.getBoundingClientRect();

        if (
            hitboxRect.left < meteorRect.left + meteorRect.width &&
            hitboxRect.left + hitboxRect.width > meteorRect.left &&
            hitboxRect.top < meteorRect.top + meteorRect.height &&
            hitboxRect.top + hitboxRect.height > meteorRect.top
        ) {
            clearInterval(interval);
            meteor.remove();
            endGame();
        }
    }, 50);
    meteor.interval = interval;
}

function increaseMeteorSpeed() {
    meteorSpeed += 2; // Increase meteor speed
}

function handleKeyPress(event) {
    if (event.key === 'Escape') {
        window.location.href = 'index.html'; // Redirect to index.html
    }
}

function endGame() {
    clearInterval(meteorInterval);
    clearInterval(timerInterval);
    clearInterval(speedIncreaseInterval);
    const gameArea = document.getElementById('gameArea');
    gameArea.removeEventListener('mousemove', movePlayerWithMouse);
    document.removeEventListener('keydown', handleKeyPress);

    // Stop all meteors
    meteors.forEach(meteor => clearInterval(meteor.interval));

    const endTime = new Date();
    const timeElapsed = ((endTime - startTime) / 1000).toFixed(3);

    const message = document.createElement('div');
    message.id = 'message';
    message.style.position = 'absolute';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.color = 'white';
    message.style.fontSize = '50px';
    message.style.textAlign = 'center';
    message.style.textShadow = '0px 0px 10px rgb(166, 0, 255)';
    message.style.fontFamily = 'pixel';
    message.innerText = `Time Survived: ${timeElapsed} seconds`;
    gameArea.appendChild(message);

    setTimeout(() => {
        window.location.href = 'index.html'; // Redirect to index.html
    }, 3000); // Show message for 3 seconds
}