/**
 * HUD element that displays the player's current health as a segmented bar.
 * The bar image is updated in six steps (0 / 20 / 40 / 60 / 80 / 100 %).
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    /** @type {string[]} Image paths for each fill level of the health bar (0 % → 100 %). */
    IMAGES = [
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
    ];

    /** @type {number} Current health percentage (0–100). */
    percentage = 100;

    /**
     * Loads all bar images, sets the initial display to 100 %, and
     * positions the bar in the top-left corner of the HUD.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercantage(100);
        this.x = 10;
        this.y = -20;
        this.width = 300;
        this.height = 80;
    }

    /**
     * Updates the displayed health bar to match the given percentage.
     * @param {number} percentage - Health value between 0 and 100.
     */
    setPercantage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Maps the current percentage to an index in the `IMAGES` array (0–5).
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
