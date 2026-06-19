let canvas;
let world;
let keyboard = new Keyboard();
let backgroundMusic = new Audio('audio/background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    backgroundMusic.play();
    init();
}

function openSettings() {
    document.getElementById('settings-screen').style.display = 'flex';
}

function closeSettings() {
    document.getElementById('settings-screen').style.display = 'none';
}

function openHelp() {
    document.getElementById('help-screen').style.display = 'flex';
}

function closeHelp() {
    document.getElementById('help-screen').style.display = 'none';
}

function muteBackgroundMusic(){
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}
function unmuteBackgroundMusic(){
    backgroundMusic.currentTime = 0;
     backgroundMusic.play();
}



function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);

    console.log(" My Character is", world.character);
}

function showGameOver() {
    document.getElementById('game-over-screen').style.display = 'block';
}

function showYouWon() {
    document.getElementById('you-won-screen').style.display = 'block';
}

function restartGame() {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('you-won-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'none';
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    init();
}

function goToHomeMenu() {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('you-won-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
}


window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode == 68) {
        keyboard.D = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode == 68) {
        keyboard.D = false;
    }
});
