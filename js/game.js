let canvas;
let world;
let keyboard = new Keyboard();
let soundsMuted = localStorage.getItem('soundsMuted') === 'true';
let musicMuted = localStorage.getItem('musicMuted') === 'true';
let backgroundMusic = new Audio('audio/background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;


/**
 * Returns true when the current device supports touch input.
 * @returns {boolean}
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Hides the start screen, shows the correct UI for touch or desktop, and initialises the world.
 */
function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('ingame-settings-btn').style.display = 'block';
    if (isTouchDevice()) {
        document.getElementById('mobile-btn-bar').style.display = 'flex';
        document.getElementById('menu_bar').style.display = 'none';
    }
    document.getElementById('start-game-btn').style.display = 'none';
    document.getElementById('restart-game-btn').style.display = 'block';
    disableHomeButtons();
    if (!musicMuted) backgroundMusic.play();
    init();
}


/**
 * Switches to the given tab and opens the settings/help dialog.
 * @param {string} [tab='settings'] - Tab identifier to show ('settings' or 'help').
 */
function openDialog(tab) {
    switchTab(tab || 'settings');
    document.getElementById('game-dialog').showModal();
}

/**
 * Closes the game dialog if it is currently open.
 */
function closeDialog() {
    const dlg = document.getElementById('game-dialog');
    if (dlg.open) dlg.close();
}

/**
 * Closes the dialog when the user clicks the backdrop outside the dialog content.
 * @param {MouseEvent} event - The click event fired on the dialog element.
 */
function closeDialogOnBackdrop(event) {
    if (event.target === document.getElementById('game-dialog')) closeDialog();
}

/**
 * Shows the selected tab panel and marks the corresponding tab button as active.
 * @param {string} tab - Tab identifier ('settings' or 'help').
 */
function switchTab(tab) {
    document.getElementById('tab-content-settings').style.display = tab === 'settings' ? 'block' : 'none';
    document.getElementById('tab-content-help').style.display = tab === 'help' ? 'block' : 'none';
    document.getElementById('tab-settings').classList.toggle('active', tab === 'settings');
    document.getElementById('tab-help').classList.toggle('active', tab === 'help');
}

/** Opens the settings tab of the dialog. */
function openSettings() { openDialog('settings'); }
/** Closes the dialog. */
function closeSettings() { closeDialog(); }
/** Opens the help tab of the dialog. */
function openHelp() { openDialog('help'); }
/** Closes the dialog. */
function closeHelp() { closeDialog(); }


/**
 * Toggles the active state of the music on/off buttons to reflect the current mute state.
 * @param {boolean} muted - Whether music is currently muted.
 */
function setMusicButtons(muted) {
    document.getElementById('music-on').classList.toggle('active', !muted);
    document.getElementById('music-off').classList.toggle('active', muted);
}

/**
 * Toggles the active state of the sounds on/off buttons to reflect the current mute state.
 * @param {boolean} muted - Whether sounds are currently muted.
 */
function setSoundsButtons(muted) {
    document.getElementById('sounds-on').classList.toggle('active', !muted);
    document.getElementById('sounds-off').classList.toggle('active', muted);
}

/**
 * Pauses background music, persists the muted state, and updates the music buttons.
 */
function muteBackgroundMusic() {
    musicMuted = true;
    localStorage.setItem('musicMuted', true);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    setMusicButtons(true);
}

/**
 * Resumes background music, persists the unmuted state, and updates the music buttons.
 */
function unmuteBackgroundMusic() {
    musicMuted = false;
    localStorage.setItem('musicMuted', false);
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    setMusicButtons(false);
}


/**
 * Persists the current `soundsMuted` flag to localStorage.
 */
function saveToLocalStorage() {
    localStorage.setItem('soundsMuted', soundsMuted);
}


/**
 * Hides the desktop menu bar on small screens so it does not overlap the game canvas.
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
    pauseCharacterAudio();
    pauseEnemyAudio();
    pauseWorldAudio();
}

/**
 * Pauses all audio sources belonging to the player character.
 */
function pauseCharacterAudio() {
    world.character.audio_snoring.pause();
    world.character.audio_you_lost.pause();
    world.character.audio_hurt.pause();
}

/**
 * Pauses all audio sources on every enemy that has them.
 */
function pauseEnemyAudio() {
    world.level.enemies.forEach(e => {
        if (e.audio_splash) e.audio_splash.pause();
        if (e.audio_attack) e.audio_attack.pause();
        if (e.audio_you_win) e.audio_you_win.pause();
    });
}

/**
 * Pauses the world-level audio sources (bottle splash and coin collect).
 */
function pauseWorldAudio() {
    world.audio_splash_bottle.pause();
    world.audio_collect_coin.pause();
}


/**
 * Unmutes all game sounds and persists the state to localStorage.
 */
function unmuteSounds() {
    soundsMuted = false;
    saveToLocalStorage();
    setSoundsButtons(false);
}


/**
 * Syncs all settings buttons with the stored mute state on page load.
 */
function initSettingsUI() {
    setMusicButtons(musicMuted);
    setSoundsButtons(soundsMuted);
}

window.addEventListener('DOMContentLoaded', initSettingsUI);

/**
 * Destroys any existing world instance and creates a fresh one on the canvas.
 */
function init() {
    if (world) world.destroy();
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}


/**
 * Displays the game-over overlay and hides the HUD bars.
 */
function showGameOver() {
    document.getElementById('game-over-screen').style.display = 'block';
    document.getElementById('menu_bar').style.display = 'none';
    document.getElementById('mobile-btn-bar').style.display = 'none';
}


/**
 * Displays the victory overlay and hides the HUD bars.
 */
function showYouWon() {
    document.getElementById('you-won-screen').style.display = 'block';
    document.getElementById('menu_bar').style.display = 'none';
    document.getElementById('mobile-btn-bar').style.display = 'none';
}


/**
 * Hides all end screens, restores the correct UI for the device, and starts a fresh game.
 */
function restartGame() {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('you-won-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'none';
    if (isTouchDevice()) {
        document.getElementById('mobile-btn-bar').style.display = 'flex';
    } else {
        document.getElementById('menu_bar').style.display = 'flex';
    }
    backgroundMusic.currentTime = 0;
    if (!musicMuted) backgroundMusic.play();
    initSettingsUI();
    init();
}


/**
 * Hides end screens and returns to the main start screen.
 */
function goToHomeMenu() {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('you-won-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('mobile-btn-bar').style.display = 'none';
    document.getElementById('menu_bar').style.display = 'flex';
    document.getElementById('start-game-btn').style.display = 'block';
    document.getElementById('restart-game-btn').style.display = 'none';
    document.getElementById('ingame-settings-btn').style.display = 'none';
}


/**
 * Maps a key name to the corresponding keyboard flag and sets it to the given value.
 * @param {string} key - The `key` value of the pressed or released key.
 * @param {boolean} value - `true` for keydown, `false` for keyup.
 */
function setKeyboardKey(key, value) {
    if (key === 'ArrowRight') keyboard.RIGHT = value;
    if (key === 'ArrowLeft')  keyboard.LEFT  = value;
    if (key === 'ArrowUp')    keyboard.UP    = value;
    if (key === 'ArrowDown')  keyboard.DOWN  = value;
    if (key === ' ')          keyboard.SPACE = value;
    if (key === 'd' || key === 'D') keyboard.D = value;
}

/**
 * Handles keydown events: closes the dialog on Escape, otherwise updates the keyboard state.
 * @param {KeyboardEvent} e - The keydown event.
 */
function handleKeyDown(e) {
    if (e.key === 'Escape') { closeDialog(); return; }
    setKeyboardKey(e.key, true);
}

/**
 * Handles keyup events and clears the corresponding keyboard flag.
 * @param {KeyboardEvent} e - The keyup event.
 */
function handleKeyUp(e) {
    setKeyboardKey(e.key, false);
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
