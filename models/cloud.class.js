/**
 * Represents a decorative cloud that drifts across the background.
 * Clouds spawn at a random horizontal position and continuously move left.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    /** @type {number} Width of the cloud image in pixels. */
    width = 400;

    /** @type {number} Height of the cloud image in pixels. */
    height = 300;

    /** @type {number} Fixed vertical position near the top of the canvas. */
    y = 5;

    /**
     * Creates a new Cloud at a random horizontal position and starts its animation.
     */
    constructor() {
        super().loadImage("img/5_background/layers/4_clouds/2.png");
        this.x = 0 + Math.random() * 3000;
        this.animate();
    }

    /**
     * Starts the continuous left-movement animation at 60 fps.
     */
    animate() {
        this.moveInterval = setInterval(() => this.moveLeft(), 1000 / 60);
    }
}
