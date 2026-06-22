let canvas;
let world;
let keyboard = new Keyboard();
let soundsMuted = localStorage.getItem('soundsMuted') === 'true';
let musicMuted = localStorage.getItem('musicMuted') === 'true';
let backgroundMusic = new Audio('audio/background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;


function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('mobile-btn-bar').style.display = 'flex';
    if (!musicMuted) backgroundMusic.play();
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
    musicMuted = true;
    localStorage.setItem('musicMuted', true);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}
function unmuteBackgroundMusic(){
    musicMuted = false;
    localStorage.setItem('musicMuted', false);
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
}

function saveToLocalStorage(){
    localStorage.setItem('soundsMuted', soundsMuted);
}

function muteSounds(){
    soundsMuted = true;
    saveToLocalStorage();
    if (!world) return;
    world.character.audio_snoring.pause();
    world.character.audio_you_lost.pause();
    world.character.audio_hurt.pause();
    world.level.enemies.forEach(e => {
        if (e.audio_splash) e.audio_splash.pause();
        if (e.audio_attack) e.audio_attack.pause();
        if (e.audio_you_win) e.audio_you_win.pause();
    });
    world.audio_splash_bottle.pause();
    world.audio_collect_coin.pause();
}

function unmuteSounds(){
    soundsMuted = false;
    saveToLocalStorage();
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
