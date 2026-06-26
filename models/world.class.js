/**
 * Central game world that owns all game objects, drives the game loop,
 * handles collision detection, collectible pickup, and canvas rendering.
 */
class World {
    /** @type {Character} The player-controlled character. */
    character = new Character();

    /** @type {Level} The active level, created by `createLevel1()`. */
    level = createLevel1();

    /** @type {CanvasRenderingContext2D} 2D rendering context of the game canvas. */
    ctx;

    /** @type {HTMLCanvasElement} The canvas element used for drawing. */
    canvas;

    /** @type {Keyboard} Current keyboard state, provided by the caller. */
    keyboard;

    /** @type {number} Horizontal camera offset applied before every draw call. */
    camera_x = 0;

    /** @type {StatusBar} HUD bar showing the character's health. */
    statusBar = new StatusBar();

    /** @type {StatusBarCoin} HUD bar showing collected coins. */
    statusBarCoin = new StatusBarCoin();

    /** @type {StatusBarSalsa} HUD bar showing the bottle inventory. */
    statusBarSalsa = new StatusBarSalsa();

    /** @type {StatusBarBoss} HUD bar showing the endboss health. */
    statusBarBoss = new StatusBarBoss();

    /** @type {ThrowableObject[]} All currently active thrown bottles. */
    throwableObject = [];

    /** @type {number} Number of coins collected (max 5). */
    coins = 0;

    /** @type {number} Number of salsa bottles held (max 5). */
    salsa = 0;

    /** @type {boolean} Prevents firing a second bottle while D is held down. */
    bottleThrown = false;

    /** @type {HTMLAudioElement} Sound played when a bottle smashes. */
    audio_splash_bottle = new Audio("audio/glass_bottle_splash.mp3");

    /** @type {HTMLAudioElement} Sound played when the character collects a coin. */
    audio_collect_coin = new Audio("audio/collect_coin.mp3");

    /**
     * Initialises the world: stores references, starts the draw loop, links objects, and runs the game loop.
     * @param {HTMLCanvasElement} canvas - The canvas to draw on.
     * @param {Keyboard} keyboard - The keyboard state object.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.ctx = canvas.getContext("2d");
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Injects the world reference into the character and links each Endboss to the character
     * so the boss can measure player distance.
     */
    setWorld() {
        this.character.world = this;
        this.endboss = this.level.enemies.find(e => e instanceof Endboss);
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                enemy.character = this.character;
            }
        });
    }

    /**
     * Starts the main game loop at 60 fps.
     * Each tick checks collisions, throw input, and collectible pickup.
     */
    run() {
        setInterval(() => {
            this.checkcolissions();
            this.checkThrowObjects();
            this.collectCoins();
            this.collectSalsa();
        }, 1000 / 60);
    }

    /**
     * Spawns a new bottle when D is pressed and the player has bottles available.
     * Enforces one throw per key press via `bottleThrown` and updates the salsa HUD.
     */
    checkThrowObjects() {
        if (this.keyboard.D && this.salsa > 0 && !this.bottleThrown) {
            let facingLeft = this.character.otherDirection;
            let xOffset = facingLeft ? -20 : 100;
            let bottle = new ThrowableObject(this.character.x + xOffset, this.character.y + 100, facingLeft);
            this.throwableObject.push(bottle);
            bottle.world = this;
            this.salsa--;
            this.bottleThrown = true;
            let percentage = (this.salsa / 5) * 100;
            this.statusBarSalsa.setPercantage(percentage);
        }
        if (!this.keyboard.D) {
            this.bottleThrown = false;
        }
    }

    /**
     * Checks all relevant collision scenarios each tick:
     * - Character vs enemies (body contact → character takes damage)
     * - Thrown bottles vs endboss (hit → boss loses energy, splash sound plays)
     * - Thrown bottles vs normal chickens (hit → chicken loses energy)
     * - Character jumping on top of an enemy (stomp → enemy hit, character bounces)
     */
    checkcolissions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !this.character.isDead() && !this.character.isHurt() && !this.character.isJumpingOnTop(enemy) && !enemy.isDead()) {
                this.character.hit();
                this.statusBar.setPercantage(this.character.energy);
            }
        });
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss) {
            this.throwableObject = this.throwableObject.filter((bottle) => {
                if (endboss.isColliding(bottle)) {
                    endboss.hit();
                    this.statusBarBoss.setPercantage(endboss.energy);
                    if (!soundsMuted) this.audio_splash_bottle.play();
                    return false;
                }
                return true;
            });
        }
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
                this.throwableObject = this.throwableObject.filter((bottle) => {
                    if (enemy.isColliding(bottle) && !enemy.isDead()) {
                        enemy.hit();
                        if (!soundsMuted) this.audio_splash_bottle.play();
                        return false;
                    }
                    return true;
                });
            }
            if (this.character.isJumpingOnTop(enemy) && !enemy.isDead()) {
                enemy.hit();
                this.character.speedY = 8;
                return;
            }
        });
    }

    /**
     * Removes a coin from the level when the character touches it,
     * plays the collect sound, increments the coin counter (max 5), and updates the HUD.
     */
    collectCoins() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.audio_collect_coin.currentTime = 0;
                if (!soundsMuted) this.audio_collect_coin.play();
                if (this.coins < 5) {
                    this.coins++;
                }
                let percentage = (this.coins / 5) * 100;
                this.statusBarCoin.setPercantage(percentage);
            }
        });
    }

    /**
     * Removes a salsa bottle from the level when the character touches it,
     * increments the bottle counter (max 5), and updates the HUD.
     */
    collectSalsa() {
        this.level.salsa.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.salsa.splice(index, 1);
                if (this.salsa < 5) {
                    this.salsa++;
                }
                let percentage = (this.salsa / 5) * 100;
                this.statusBarSalsa.setPercantage(percentage);
            }
        });
    }

    /**
     * Clears the canvas and redraws all objects every animation frame.
     * Background and clouds are translated with the camera; HUD elements remain fixed.
     * Uses `requestAnimationFrame` for smooth rendering.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarSalsa);
        this.addToMap(this.statusBarBoss);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.salsa);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObject);

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Calls `addToMap` for every object in the given array.
     * @param {DrawableObject[]} objects - Array of drawable game objects.
     */
    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
    }

    /**
     * Draws a single object onto the canvas, flipping the sprite horizontally if needed.
     * @param {MovableObject} movableObject - The object to draw.
     */
    addToMap(movableObject) {
        if (movableObject.otherDirection) {
            this.flipImage(movableObject);
        }
        movableObject.draw(this.ctx);
        movableObject.drawFrame(this.ctx);
        if (movableObject.otherDirection) {
            this.flipImageBack(movableObject);
        }
    }

    /**
     * Saves canvas state and applies a horizontal flip transform for left-facing sprites.
     * @param {MovableObject} movableObject - The object whose sprite needs flipping.
     */
    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    /**
     * Restores canvas state after a horizontal flip and un-negates the object's x position.
     * @param {MovableObject} movableObject - The object that was flipped.
     */
    flipImageBack(movableObject) {
        this.ctx.restore();
        movableObject.x = movableObject.x * -1;
    }
}
