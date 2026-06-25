/**
 * HUD element that displays the player's salsa-bottle inventory as a segmented bar.
 * The bar image is updated in six steps (0 / 20 / 40 / 60 / 80 / 100 %).
 * @extends DrawableObject
 */
class StatusBarSalsa extends DrawableObject {
    /** @type {string[]} Image paths for each fill level of the salsa bar (0 % → 100 %). */
    IMAGES_SALSA = [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
    ];

    /** @type {number} Current bottle percentage (0–100). */
    percentage = 0;

    /**
     * Loads all bar images, sets the initial display to 0 %, and
     * positions the bar below the coin bar in the HUD.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_SALSA);
        this.setPercantage(0);
        this.x = 10;
        this.y = 100;
        this.width = 300;
        this.height = 80;
    }

    /**
     * Updates the displayed salsa bar to match the given percentage.
     * @param {number} percentage - Bottle fill value between 0 and 100.
     */
    setPercantage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_SALSA[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Maps the current percentage to an index in the `IMAGES_SALSA` array (0–5).
     * @returns {number} Image index for the current fill level.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
