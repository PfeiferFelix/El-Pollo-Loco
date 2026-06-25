/**
 * Base class for all objects that can move, collide, or take damage.
 * Provides physics (gravity, jumping), collision detection, animation helpers, and a health system.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    /** @type {number} Horizontal movement speed in pixels per tick. */
    speed = 0.15;

    /** @type {boolean} When true the sprite is drawn flipped horizontally (facing left). */
    otherDirection = false;

    /** @type {number} Vertical velocity in pixels per physics tick (positive = upward). */
    speedY = 0;

    /** @type {number} Gravity constant subtracted from `speedY` each physics tick. */
    acceleration = 1;

    /** @type {number} Current health points (0 = dead, 100 = full). */
    energy = 100;

    /** @type {number} Timestamp (ms) of the last received hit — used by `isHurt()`. */
    lastHit = 0;

    /** @type {{top:number, left:number, right:number, bottom:number}} Inset from sprite edges to effective hitbox. */
    offset = { top: 0, left: 0, right: 0, bottom: 0 };

    /**
     * Starts the gravity loop at 25 fps.
     * While the object is above ground or still moving upward, applies vertical velocity and
     * reduces it by `acceleration` each tick.
     * For `ThrowableObject` instances, also handles the bottle-splash sequence when hitting the ground.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isaboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
            if (this instanceof ThrowableObject && this.y > this.groundY) {
                clearInterval(this.ThrowIntervall);
                clearInterval(this.animateInterval);
                this.speedY = 0;
                if (!this.splashSoundPlayed) {
                    this.splashSoundPlayed = true;
                    if (!soundsMuted) {
                        this.world.audio_splash_bottle.currentTime = 0;
                        this.world.audio_splash_bottle.play();
                    }
                }
                this.playAnimation(this.BOTTLE_SPLASH);
                if (this.currentImage >= this.BOTTLE_SPLASH.length) {
                    this.world.throwableObject = this.world.throwableObject.filter(bottle => bottle !== this);
                }
            }
        }, 1000 / 25);
    }

    /**
     * Returns true when this object is above its ground level.
     * For `ThrowableObject` the ground level is `this.groundY`; for all others it is y < 150.
     * @returns {boolean}
     */
    isaboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y <= this.groundY;
        } else {
            return this.y < 150;
        }
    }

    /**
     * Returns true when the AABB of this object overlaps with `movableObject`.
     * @param {MovableObject} movableObject - The object to test collision against.
     * @returns {boolean}
     */
    isColliding(mo) {
        const aLeft   = this.x + this.offset.left;
        const aRight  = this.x + this.width  - this.offset.right;
        const aTop    = this.y + this.offset.top;
        const aBottom = this.y + this.height - this.offset.bottom;
        const bLeft   = mo.x + mo.offset.left;
        const bRight  = mo.x + mo.width  - mo.offset.right;
        const bTop    = mo.y + mo.offset.top;
        const bBottom = mo.y + mo.height - mo.offset.bottom;
        return aRight > bLeft && aBottom > bTop && aLeft < bRight && aTop < bBottom;
    }

    isJumpingOnTop(enemy) {
        const myBottom  = this.y + this.height - this.offset.bottom;
        const enemyTop  = enemy.y + enemy.offset.top;
        return this.speedY < 0 && this.isColliding(enemy) && myBottom < enemyTop + 40;
    }

    /**
     * Moves the object to the right by `speed` pixels.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by `speed` pixels.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Plays a looping animation by cycling through the `images` array.
     * Resets the frame index when the animation changes.
     * @param {string[]} images - Array of image paths to cycle through.
     */
    playAnimation(images) {
        if (this.currentAnimation !== images) {
            this.currentImage = 0;
            this.currentAnimation = images;
        }
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Plays a one-shot animation that stops on the last frame.
     * Resets the frame index when the animation changes.
     * @param {string[]} images - Array of image paths to play through once.
     */
    playAnimationOnce(images) {
        if (this.currentAnimation !== images) {
            this.currentImage = 0;
            this.currentAnimation = images;
        }
        if (this.currentImage < images.length) {
            this.img = this.imageCache[images[this.currentImage]];
            this.currentImage++;
        }
    }

    /**
     * Initiates a jump by setting the vertical speed.
     */
    jump() {
        this.speedY = 15;
    }

    /**
     * Reduces energy by 5 and records the hit timestamp.
     * Energy is clamped to a minimum of 0.
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
        if (this.isDead) {
            return;
        }
    }

    /**
     * Returns true when the object was hit within the last 300 ms.
     * @returns {boolean}
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.3;
    }

    /**
     * Returns true when the object's energy has reached 0.
     * @returns {boolean}
     */
    isDead() {
        return this.energy == 0;
    }
}
