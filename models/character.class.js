/**
 * The player-controlled character (Pepe).
 * Handles movement input, state-based animations, audio feedback, and camera tracking.
 * @extends MovableObject
 */
class Character extends MovableObject {
    /** @type {number} Height of the character sprite in pixels. */
    height = 280;

    /** @type {number} Width of the character sprite in pixels. */
    width = 150;

    /** @type {number} Initial vertical position. */
    y = 150;

    /** @type {number} Horizontal movement speed in pixels per frame. */
    speed = 10;

    offset = { top: 120, left: 30, right: 30, bottom: 10 };

    /** @type {string[]} Animation frames for the walking state. */
    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png",
    ];

    /** @type {string[]} Animation frames for the jump arc. */
    IMAGES_JUMPING = [
        "img/2_character_pepe/3_jump/J-31.png",
        "img/2_character_pepe/3_jump/J-32.png",
        "img/2_character_pepe/3_jump/J-33.png",
        "img/2_character_pepe/3_jump/J-34.png",
        "img/2_character_pepe/3_jump/J-35.png",
        "img/2_character_pepe/3_jump/J-36.png",
        "img/2_character_pepe/3_jump/J-37.png",
        "img/2_character_pepe/3_jump/J-38.png",
        "img/2_character_pepe/3_jump/J-39.png",
    ];

    /** @type {string[]} Animation frames for the death sequence. */
    IMAGES_DEAD = [
        "img/2_character_pepe/5_dead/D-51.png",
        "img/2_character_pepe/5_dead/D-52.png",
        "img/2_character_pepe/5_dead/D-53.png",
        "img/2_character_pepe/5_dead/D-54.png",
        "img/2_character_pepe/5_dead/D-55.png",
        "img/2_character_pepe/5_dead/D-56.png",
        "img/2_character_pepe/5_dead/D-57.png",
    ];

    /** @type {string[]} Animation frames played when the character takes damage. */
    IMAGES_HURT = [
        "img/2_character_pepe/4_hurt/H-41.png",
        "img/2_character_pepe/4_hurt/H-42.png",
        "img/2_character_pepe/4_hurt/H-43.png",
    ];

    /** @type {string[]} Short idle animation frames (played after brief inactivity). */
    IMAGES_IDLE = [
        "img/2_character_pepe/1_idle/idle/I-1.png",
        "img/2_character_pepe/1_idle/idle/I-2.png",
        "img/2_character_pepe/1_idle/idle/I-3.png",
        "img/2_character_pepe/1_idle/idle/I-4.png",
        "img/2_character_pepe/1_idle/idle/I-5.png",
        "img/2_character_pepe/1_idle/idle/I-6.png",
        "img/2_character_pepe/1_idle/idle/I-7.png",
        "img/2_character_pepe/1_idle/idle/I-8.png",
        "img/2_character_pepe/1_idle/idle/I-9.png",
        "img/2_character_pepe/1_idle/idle/I-10.png",
    ];

    /** @type {string[]} Long idle animation frames with snoring (played after 15 s of inactivity). */
    IMAGES_LONG_IDLE = [
        "img/2_character_pepe/1_idle/long_idle/I-11.png",
        "img/2_character_pepe/1_idle/long_idle/I-12.png",
        "img/2_character_pepe/1_idle/long_idle/I-13.png",
        "img/2_character_pepe/1_idle/long_idle/I-14.png",
        "img/2_character_pepe/1_idle/long_idle/I-15.png",
        "img/2_character_pepe/1_idle/long_idle/I-16.png",
        "img/2_character_pepe/1_idle/long_idle/I-17.png",
        "img/2_character_pepe/1_idle/long_idle/I-18.png",
        "img/2_character_pepe/1_idle/long_idle/I-19.png",
        "img/2_character_pepe/1_idle/long_idle/I-20.png",
    ];

    /** @type {HTMLAudioElement} Snoring sound played during the long-idle state. */
    audio_snoring = new Audio("audio/snoring.mp3");

    /** @type {HTMLAudioElement} Sound played when the player loses. */
    audio_you_lost = new Audio("audio/you_lost.mp3");

    /** @type {HTMLAudioElement} Sound played when the character is hurt. */
    audio_hurt = new Audio("audio/pepe_hurt.mp3");

    /** @type {World} Reference to the game world, set after instantiation. */
    world;

    /** @type {number} Index of the currently displayed animation frame. */
    currentImage = 0;

    /** @type {number} Timestamp (ms) of the last player action — used to detect idling. */
    lastActionTime = Date.now();

    /**
     * Loads all animation sets, starts the movement and animation loops, and applies gravity.
     */
    constructor() {
        super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.animate();
        this.applyGravity();
    }

    /**
     * Starts two recurring intervals:
     * - movement handling at 60 fps
     * - animation state evaluation at ~14 fps (70 ms)
     */
    animate() {
        setInterval(() => this.handleMovement(), 1000/60);
        setInterval(() => this.playAnimationState(), 130);
    }

    /**
     * Reads keyboard input and moves the character left or right within level bounds.
     * Does nothing when the character or the endboss is dead.
     */
    handleMovement() {
        if (this.isDead() || (this.world.endboss && this.world.endboss.isDead())) return;
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.lastActionTime = Date.now();
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.lastActionTime = Date.now();
        }
        this.handleJumpAndCamera();
    }

    /**
     * Handles jump input (UP / SPACE) and keeps the camera centred on the character.
     * Also refreshes `lastActionTime` when the throw key (D) is pressed.
     */
    handleJumpAndCamera() {
        if ((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isaboveGround()) {
            this.jump();
            this.lastActionTime = Date.now();
        }
        if (this.world.keyboard.D) {
            this.lastActionTime = Date.now();
        }
        this.world.camera_x = -this.x + 80;
    }

    /**
     * Selects the correct animation to play based on the current character state.
     * Priority: dead → endboss dead → hurt → airborne → walking → long-idle → idle.
     * Also resets the hurt-audio flag when the character recovers.
     */
    playAnimationState() {
        if (this.isDead()) {
            this.handleDead();
        } else if (this.world.endboss && this.world.endboss.isDead()) {
            this.stopAmbientAudio();
        } else if (this.isHurt()) {
            this.hurtAudio();
            this.handleHurt();
        } else if (this.isaboveGround() || this.speedY > 0) {
            this.handleAboveGround();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.handleWalking();
        } else if (Date.now() - this.lastActionTime > 15000) {
            this.handleLongIdle();
        } else {
            this.handleIdle();
        }
        if (!this.isHurt()) {
            this.audio_hurtPlayed = false;
        }
    }

    /**
     * Plays the death animation once, stops ambient audio, plays the game-over sound,
     * freezes the endboss attack, and shows the game-over screen after 1.5 s.
     */
    handleDead() {
        this.playAnimationOnce(this.IMAGES_DEAD);
        this.audio_snoring.pause();
        this.audio_snoring.currentTime = 0;
        if (!this.audio_you_lostPlayed) {
            this.audio_you_lostPlayed = true;
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            if (!soundsMuted) this.audio_you_lost.play();
            if (this.world.endboss) {
                this.world.endboss.audio_attack.pause();
                this.world.endboss.audio_attack.currentTime = 0;
                clearInterval(this.world.endboss.jumpRepeatInterval);
            }
            setTimeout(() => showGameOver(), 1500);
        }
    }

    /**
     * Plays the hurt animation and silences ambient sounds.
     */
    handleHurt() {
        this.playAnimation(this.IMAGES_HURT);
        this.stopAmbientAudio();
    }

    /**
     * Plays the jump animation and silences ambient sounds while the character is airborne.
     */
    handleAboveGround() {
        this.playAnimationOnce(this.IMAGES_JUMPING);
        this.stopAmbientAudio();
    }

    /**
     * Plays the walking animation and silences ambient sounds.
     */
    handleWalking() {
        this.playAnimation(this.IMAGES_WALKING);
        this.stopAmbientAudio();
    }

    /**
     * Plays the long-idle (snoring) animation and starts the snoring audio after 15 s of inactivity.
     */
    handleLongIdle() {
        this.playAnimation(this.IMAGES_LONG_IDLE);
        if (!soundsMuted) this.audio_snoring.play();
        this.audio_you_lost.pause();
        this.audio_you_lost.currentTime = 0;
    }

    /**
     * Plays the short idle animation and silences ambient sounds.
     */
    handleIdle() {
        this.playAnimation(this.IMAGES_IDLE);
        this.stopAmbientAudio();
    }

    /**
     * Pauses and resets both ambient audio tracks (snoring and you-lost).
     */
    stopAmbientAudio() {
        this.audio_snoring.pause();
        this.audio_snoring.currentTime = 0;
        this.audio_you_lost.pause();
        this.audio_you_lost.currentTime = 0;
    }

    /**
     * Initiates a jump by setting the vertical speed.
     */
    jump() {
        this.speedY = 16;
        this.img = this.imageCache[this.IMAGES_JUMPING[0]];
    }

    /**
     * Plays the hurt sound once per damage event, guarded by `audio_hurtPlayed`.
     */
    hurtAudio() {
        if (this.isHurt()) {
            if (!this.audio_hurtPlayed) {
                this.audio_hurtPlayed = true;
                if (!soundsMuted) this.audio_hurt.play();
            }
        }
    }
}
