/**
 * Represents a small chicken enemy that moves left across the screen.
 * Extends MovableObject and is killed in a single hit.
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject {
    /** @type {number} Height of the sprite in pixels. */
    height = 100;

    /** @type {number} Width of the sprite in pixels. */
    width = 90;

    /** @type {number} Fixed vertical position on screen. */
    y = 330;

    offset = { top: 20, left: 20, right: 20, bottom: 10 };

    /** @type {string[]} Walking animation frame paths. */
    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ];

    /** @type {string[]} Death animation frame paths. */
    IMAGES_DEAD = [
        "img/3_enemies_chicken/chicken_small/2_dead/dead.png",
    ];

    /** @type {HTMLAudioElement} Sound played when the chicken dies. */
    audio_splash = new Audio("audio/chicken_small_splash.mp3");

    /**
     * Creates a new ChickenSmall instance.
     * Loads the sprite images, sets a random horizontal position and speed,
     * and starts the animation loop.
     */
    constructor() {
        super().loadImage(
            "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        );
        this.x = 300 + Math.random() * 4800; /** random position between 300 and 4800 */
        this.speed = 0.15 + Math.random() * 0.5; /** random speed between 0.15 and 0.65 */
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    /**
     * Instantly kills the chicken by setting its energy to 0.
     * One hit is enough — no damage calculation needed.
     */
    hit() {
        this.energy = 0;
    }

    /**
     * Starts two independent intervals:
     * 1. Movement loop (60 fps) — moves the chicken left every frame.
     * 2. Animation loop (10 fps) — switches between walking and death animation.
     *    When the chicken is dead, it stops moving and plays the death frame.
     */
    animate() {
        this.movementInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
        this.animationInterval = setInterval(() => {
            if (this.isDead()) {
                this.deadAudio();
                this.playAnimation(this.IMAGES_DEAD);
                this.y = 330;
                clearInterval(this.movementInterval);
                return;
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
            this.audio_splashPlayed = false;
        }, 100);
    }

    /**
     * Plays the death sound once when the chicken is dead.
     * Uses the `audio_splashPlayed` flag to prevent the sound from repeating
     * across animation ticks. Respects the global `soundsMuted` setting.
     */
    deadAudio() {
        if (this.isDead) {
            if (!this.audio_splashPlayed) {
                this.audio_splashPlayed = true;
                if (!soundsMuted) this.audio_splash.play();
            }
        }
    }
}