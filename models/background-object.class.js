/**
 * Represents a static background tile in the game world.
 * Background objects fill the full canvas height and are positioned
 * along the x-axis to compose the scrolling level scenery.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
    /** @type {number} Fixed height matching the canvas height in pixels. */
    height = 480;

    /** @type {number} Fixed width matching the canvas width in pixels. */
    width = 720;

    /**
     * Creates a new BackgroundObject.
     * @param {string} imagePath - Path to the background image asset.
     * @param {number} x - Horizontal position of the object in the game world.
     */
    constructor(imagePath, x) {
        {
            super().loadImage(imagePath);
            this.x = x;
            this.y = 480 - this.height;
        }
    }
}
