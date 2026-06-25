/**
 * Represents a collectible coin in the game world.
 * Coins are spawned at random positions along the level and can be collected by the player.
 * @extends MovableObject
 */
class Coin extends MovableObject {
    /** @type {number} Width of the coin in pixels. */
    width = 100;

    /** @type {number} Height of the coin in pixels. */
    height = 100;

    /**
     * Creates a new Coin instance at a random position within the level.
     * Horizontal position is randomized between x=1000 and x=4800.
     * Vertical position is randomized between y=200 and y=300.
     */
    constructor() {
        super().loadImage("img/8_coin/coin_1.png");
        this.x = 1000 + Math.random() * 3800;
        this.y = 200 + Math.random() * 100;
    }
}