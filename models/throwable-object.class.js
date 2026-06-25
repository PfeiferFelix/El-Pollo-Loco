/**
 * A salsa bottle thrown by the player.
 * Follows a parabolic arc, rotates during flight, and plays a splash animation on impact.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    /** @type {string[]} Animation frames cycling during the bottle's flight. */
    THROW_BOTTLE = [
        "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];

    /** @type {string[]} Animation frames played when the bottle hits the ground or an enemy. */
    BOTTLE_SPLASH = [
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ];

    /**
     * Creates and immediately throws a bottle from the given position.
     * @param {number} x - Starting x-coordinate (usually the character's x + offset).
     * @param {number} y - Starting y-coordinate (usually the character's y + offset).
     */
    constructor(x, y) {
        super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
        this.loadImages(this.THROW_BOTTLE);
        this.loadImages(this.BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.groundY = 350;
        this.height = 100;
        this.width = 80;
        this.throw();
    }

    /**
     * Starts the rotation animation interval at 10 fps.
     */
    animate() {
        this.animateInterval = setInterval(() => {
            this.playAnimation(this.THROW_BOTTLE);
        }, 100);
    }

    /**
     * Launches the bottle to the right with an upward arc.
     * Applies gravity for the vertical arc and moves the bottle right by 10 px every 25 ms.
     * Stops horizontal movement after 500 distance units.
     */
    throw() {
        this.speedY = 10;
        this.applyGravity();
        let distance = 0;
        this.ThrowIntervall = setInterval(() => {
            this.x += 10;
            distance += 5;
            if (distance >= 500) {
                clearInterval(this.ThrowIntervall);
            }
        }, 25);
        this.animate();
    }
}
