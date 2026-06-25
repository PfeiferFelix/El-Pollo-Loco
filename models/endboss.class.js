/**
 * The final boss enemy of the game — a giant chicken that reacts to the player's proximity.
 * Cycles through alert, walk, attack, hurt, and dead states with corresponding animations and audio.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    /** @type {number} Height of the endboss sprite in pixels. */
    height = 400;

    /** @type {number} Width of the endboss sprite in pixels. */
    width = 300;

    /** @type {number} Fixed vertical position of the endboss. */
    y = 50;

    /** @type {string[]} Animation frames played when the endboss spots the player. */
    IMAGES_ALERT = [
        "img/4_enemie_boss_chicken/2_alert/G5.png",
        "img/4_enemie_boss_chicken/2_alert/G6.png",
        "img/4_enemie_boss_chicken/2_alert/G7.png",
        "img/4_enemie_boss_chicken/2_alert/G8.png",
        "img/4_enemie_boss_chicken/2_alert/G9.png",
        "img/4_enemie_boss_chicken/2_alert/G10.png",
        "img/4_enemie_boss_chicken/2_alert/G11.png",
        "img/4_enemie_boss_chicken/2_alert/G12.png",
    ];

    /** @type {string[]} Animation frames for the walking state. */
    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/1_walk/G1.png",
        "img/4_enemie_boss_chicken/1_walk/G2.png",
        "img/4_enemie_boss_chicken/1_walk/G3.png",
        "img/4_enemie_boss_chicken/1_walk/G4.png",
    ];

    /** @type {string[]} Animation frames played when the endboss takes damage. */
    IMAGES_HURT = [
        "img/4_enemie_boss_chicken/4_hurt/G21.png",
        "img/4_enemie_boss_chicken/4_hurt/G22.png",
        "img/4_enemie_boss_chicken/4_hurt/G23.png",
    ];

    /** @type {string[]} Animation frames for the death sequence. */
    IMAGES_DEAD = [
        "img/4_enemie_boss_chicken/5_dead/G24.png",
        "img/4_enemie_boss_chicken/5_dead/G25.png",
        "img/4_enemie_boss_chicken/5_dead/G26.png",
    ];

    /** @type {string[]} Animation frames played during a jump-attack. */
    IMAGES_ATTACK = [
        "img/4_enemie_boss_chicken/3_attack/G13.png",
        "img/4_enemie_boss_chicken/3_attack/G14.png",
        "img/4_enemie_boss_chicken/3_attack/G15.png",
        "img/4_enemie_boss_chicken/3_attack/G16.png",
        "img/4_enemie_boss_chicken/3_attack/G17.png",
        "img/4_enemie_boss_chicken/3_attack/G18.png",
        "img/4_enemie_boss_chicken/3_attack/G19.png",
        "img/4_enemie_boss_chicken/3_attack/G20.png",
    ];

    /** @type {HTMLAudioElement} Sound played when the player wins. */
    audio_you_win = new Audio("audio/you_win.mp3");

    /** @type {HTMLAudioElement} Sound played during an attack jump. */
    audio_attack = new Audio("audio/chicken_dead.mp3");

    /**
     * Creates the endboss, loads all animation image sets, sets the starting position,
     * initialises state flags, and starts the animation loop.
     */
    constructor() {
        super().loadImage("img/4_enemie_boss_chicken/2_alert/G5.png");
        this.speed = 0.15;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = 4800;
        this.isAlerted = false;
        this.alertFinished = false;
        this.hasJumped = false;
        this.isJumping = false;
        this.animate();
    }

    /**
     * Reduces the endboss energy by 20 per hit and records the timestamp of the last hit.
     * Energy is clamped to a minimum of 0.
     */
    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Starts the two main loops:
     * - an animation interval (200 ms) that drives state-based frame playback
     * - a movement interval (60 fps) that moves the boss left when alerted and the player is far away
     */
    animate() {
        this.animationInterval = setInterval(() => this.playStateAnimation(), 200);
        this.moveInterval = setInterval(() => {
            if (this.alertFinished && !this.isDead() && this.CharacterIsNotInSight()) this.moveLeft();
        }, 1000 / 60);
    }

    /**
     * Selects and plays the correct animation frame set based on the current boss state.
     * Priority order: dead → hurt → not alerted → alert playing → player out of sight → attack.
     */
    playStateAnimation() {
        if (this.isDead()) {
            this.handleDead();
            this.youWon();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (!this.isAlerted) {
            this.handleWalking();
        } else if (!this.alertFinished) {
            this.playAnimation(this.IMAGES_ALERT);
        } else if (this.CharacterIsNotInSight()) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.handleAttack();
        }
    }

    /**
     * Handles the death state: stops movement, adjusts vertical position,
     * plays the death animation once, and clears all intervals when finished.
     */
    handleDead() {
        clearInterval(this.moveInterval);
        this.y = 80;
        this.playAnimationOnce(this.IMAGES_DEAD);
        if (this.currentImage >= this.IMAGES_DEAD.length) {
            clearInterval(this.animationInterval);
            clearInterval(this.jumpRepeatInterval);
        }
    }

    /**
     * Plays the walking animation and transitions to the alert state
     * when the character enters the detection range (300 px).
     */
    handleWalking() {
        this.playAnimation(this.IMAGES_WALKING);
        if (this.isCharacterInSight()) {
            this.isAlerted = true;
            setTimeout(() => { this.alertFinished = true; }, this.IMAGES_ALERT.length * 200);
        }
    }

    /**
     * Plays the attack animation and triggers the first jump-attack after a 1 s delay.
     * Subsequent jump-attacks repeat as long as the player stays in range.
     */
    handleAttack() {
        this.playAnimation(this.IMAGES_ATTACK);
        if (!this.hasJumped) {
            this.hasJumped = true;
            this.currentImage = 0;
            setTimeout(() => {
                if (this.isDead()) return;
                this.jumpVorwoard();
                this.jumpRepeatInterval = setInterval(() => {
                    if (!this.CharacterIsNotInSight() && !this.isDead()) this.jumpVorwoard();
                }, this.IMAGES_ATTACK.length * 200);
            }, 1000);
        }
    }

    /**
     * Returns true when the character is within 300 px (detection/attack range).
     * @returns {boolean}
     */
    isCharacterInSight() {
        let distance = this.x - this.character.x;
        return distance < 300;
    }

    /**
     * Returns true when the character is 300 px or more away (outside attack range).
     * @returns {boolean}
     */
    CharacterIsNotInSight() {
        let distance = this.x - this.character.x;
        return distance >= 300;
    }

    /**
     * Executes a parabolic jump-attack toward the player.
     * The boss moves left and arcs up for the first 60 distance units, then back down.
     * Resets vertical position and clears the interval after 120 distance units.
     */
    jumpVorwoard() {
        this.isJumping = true;
        this.attackAudio();
        let distance = 0;
        let jumpVorwoardInterval = setInterval(() => {
            if (!this.CharacterIsNotInSight()) {
                this.x -= 10;
            }
            distance += 5;
            if (distance <= 60) {
                this.y -= 5;
            } else {
                this.y += 5;
            }
            if (distance >= 120) {
                clearInterval(jumpVorwoardInterval);
                this.y = 50;
                this.isJumping = false;
            }
            this.audio_attackPlayed = false;
        }, 25);
    }

    /**
     * Triggers the win sequence once the endboss is dead:
     * pauses background music, plays the victory sound, shows the win screen after 1.5 s,
     * and disables all character movement.
     */
    youWon() {
        if (this.isDead()) {
            if (!this.audio_you_winPlayed) {
                this.audio_you_winPlayed = true;
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
                if (!soundsMuted) this.audio_you_win.play();
                setTimeout(() => showYouWon(), 1500);
                this.moveLeft = false;
                this.character.moveRight = false;
                this.character.jump = false;
            }
        }
    }

    /**
     * Plays the attack sound once per jump. Prevents the sound from repeating
     * within the same jump cycle via the `audio_attackPlayed` flag.
     */
    attackAudio() {
        if (this.isJumping) {
            if (!this.audio_attackPlayed) {
                this.audio_attackPlayed = true;
                if (!soundsMuted) this.audio_attack.play();
            }
        }
    }
}
