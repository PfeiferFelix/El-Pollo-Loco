/**
 * Base class for all drawable game objects.
 * Provides image loading, caching, and canvas rendering functionality.
 */
class DrawableObject {
    /** @type {HTMLImageElement} The currently active image element. */
    img;

    /** @type {number} Horizontal position on the canvas in pixels. */
    x = 100;

    /** @type {number} Vertical position on the canvas in pixels. */
    y = 255;

    /** @type {number} Render height in pixels. */
    height = 170;

    /** @type {number} Render width in pixels. */
    width = 130;

    /** @type {Object.<string, HTMLImageElement>} Cache mapping image paths to preloaded Image elements. */
    imageCache = {};

    /** @type {number} Index of the currently displayed frame in an animation sequence. */
    currentImage = 0;

    /**
     * Loads a single image and assigns it to `this.img`.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the current image onto the canvas at the object's position and dimensions.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    draw(ctx) {
        ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height,
        );
    }

    /**
     * Preloads an array of images into `imageCache` for later use during animations.
     * @param {string[]} arr - Array of image file paths to preload.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws a debug frame (bounding box) around the object on the canvas.
     * Only renders for Character, Chicken, ChickenSmall, SalsaBottle, and Endboss instances.
     * The stroke is transparent by default — change `strokeStyle` to make it visible during debugging.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall || this instanceof SalsaBottle || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "transparent";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }
}
