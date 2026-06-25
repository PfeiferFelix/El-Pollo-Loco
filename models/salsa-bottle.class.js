/**
 * Represents a collectible salsa bottle placed in the level.
 * When picked up it adds one bottle to the player's throw inventory.
 * @extends MovableObject
 */
class SalsaBottle extends MovableObject {
    /** @type {number} Width of the bottle sprite in pixels. */
    width = 100;

    /** @type {number} Height of the bottle sprite in pixels. */
    height = 100;

    /**
     * Creates a SalsaBottle at a random position within the level.
     * Horizontal position is randomized between x=1000 and x=4800.
     * Vertical position is randomized between y=200 and y=300.
     */
    constructor() {
        super().loadImage("img/7_statusbars/3_icons/icon_salsa_bottle.png");
        this.x = 1000 + Math.random() * 3800;
        this.y = 200 + Math.random() * 100;
    }
}
