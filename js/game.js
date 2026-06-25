let canvas;
let world;
let keyboard = new Keyboard();
let soundsMuted = localStorage.getItem('soundsMuted') === 'true';
let musicMuted = localStorage.getItem('musicMuted') === 'true';
let backgroundMusic = new Audio('audio/background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;


/**
 * This function makes the start screen invisible
 * When the Screen size is small the button bar on mobile will show up and the h1 will disapear
 * so have no scrollbar.
 */
function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('ingame-settings-btn').style.display = 'block';
    if (window.innerWidth <= 768 || window.innerHeight <= 500) {
        document.getElementById('mobile-btn-bar').style.display = 'flex';
        document.querySelector('h1').style.display = 'none';
    }
    disableHomeButtons();
    if (!musicMuted) backgroundMusic.play();
    init();
}


function openDialog(tab) {
    switchTab(tab || 'settings');
    document.getElementById('game-dialog').style.display = 'flex';
}

function closeDialog() {
    document.getElementById('game-dialog').style.display = 'none';
}

function closeDialogOnBackdrop(event) {
    if (event.target === document.getElementById('game-dialog')) closeDialog();
}

function switchTab(tab) {
    document.getElementById('tab-content-settings').style.display = tab === 'settings' ? 'block' : 'none';
    document.getElementById('tab-content-help').style.display = tab === 'help' ? 'block' : 'none';
    document.getElementById('tab-settings').classList.toggle('active', tab === 'settings');
    document.getElementById('tab-help').classList.toggle('active', tab === 'help');
}

function openSettings() { openDialog('settings'); }
function closeSettings() { closeDialog(); }
function openHelp() { openDialog('help'); }
function closeHelp() { closeDialog(); }


function setMusicButtons(muted) {
    document.getElementById('music-on').classList.toggle('active', !muted);
    document.getElementById('music-off').classList.toggle('active', muted);
}

function setSoundsButtons(muted) {
    document.getElementById('sounds-on').classList.toggle('active', !muted);
    document.getElementById('sounds-off').classList.toggle('active', muted);
}

function muteBackgroundMusic() {
    musicMuted = true;
    localStorage.setItem('musicMuted', true);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    setMusicButtons(true);
}

function unmuteBackgroundMusic() {
    musicMuted = false;
    localStorage.setItem('musicMuted', false);
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    setMusicButtons(false);
}


/**
 * saves the mute state to local storage
 */
function saveToLocalStorage() {
    localStorage.setItem('soundsMuted', soundsMuted);
}


/**
 * when the screen size is small the menu bar will be transparent
 */
function disableHomeButtons() {
    if (window.innerWidth <= 768 || window.innerHeight <= 500) {
        document.getElementById("menu_bar").style.display = 'none';
    }
}


/**
 * Mutes all game sounds and persists the muted state to localStorage.
 * Sets the global `soundsMuted` flag to true and pauses all active audio
 * sources: character sounds (snoring, hurt, lose), enemy sounds (splash,
 * attack, win), and world sounds (bottle splash, coin collect).
 * Returns early without touching audio if the world is not yet initialised.
 */
function muteSounds() {
    soundsMuted = true;
    saveToLocalStorage();
    setSoundsButtons(true);
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


function unmuteSounds() {
    soundsMuted = false;
    saveToLocalStorage();
    setSoundsButtons(false);
}


function initSettingsUI() {
    setMusicButtons(musicMuted);
    setSoundsButtons(soundsMuted);
}

window.addEventListener('DOMContentLoaded', initSettingsUI);

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}


/**
 * game over screen
 */
function showGameOver() {
    document.getElementById('game-over-screen').style.display = 'block';
}


/**
 * you won screen
 */
function showYouWon() {
    document.getElementById('you-won-screen').style.display = 'block';
}


/**
 * game over, you won and start screen will be transparen
 * game starts from beginning
 */
function restartGame() {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('you-won-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'none';
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    init();
}


/**
 * gose back to the main menu
 */
function goToHomeMenu() {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('you-won-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
}


/**
 * key down key codes to move the character
 */
window.addEventListener("keydown", (e) => {
    if (e.key === 'Escape') { closeDialog(); return; }
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


/**
 * keyup keycodes to move the character
 */
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
