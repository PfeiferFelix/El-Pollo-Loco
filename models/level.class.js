/**
 * Represents a game level and holds all objects that populate it.
 * Passed into the World to define the content of the current stage.
 */
class Level {
    /** @type {Cloud[]} Array of cloud objects scrolling in the background. */
    clouds;

    /** @type {Coin[]} Array of collectible coins placed throughout the level. */
    coins;

    /** @type {SalsaBottle[]} Array of salsa bottles the player can pick up. */
    salsa;

    /** @type {(Chicken|Endboss)[]} Array of enemy objects the player must avoid or defeat. */
    enemies;

    /** @type {BackgroundObject[]} Array of background layer objects for parallax scrolling. */
    backgroundObjects;

    /** @type {number} The x-coordinate at which the level ends. */
    level_end_x = 4800;

    /**
     * Creates a new Level with the given sets of game objects.
     * @param {Cloud[]} clouds - Background cloud objects.
     * @param {Coin[]} coins - Collectible coins.
     * @param {SalsaBottle[]} salsa - Throwable salsa bottles.
     * @param {(Chicken|Endboss)[]} enemies - Enemies in this level.
     * @param {BackgroundObject[]} backgroundObjects - Parallax background layers.
     */
    constructor(clouds, coins, salsa, enemies, backgroundObjects) {
        this.clouds = clouds;
        this.coins = coins;
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.salsa = salsa;
    }
}
