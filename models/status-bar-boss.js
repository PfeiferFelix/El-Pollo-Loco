/**
 * HUD element that displays the endboss's remaining health as a segmented bar.
 * The bar image is updated in six steps (0 / 20 / 40 / 60 / 80 / 100 %).
 * Positioned on the right side of the HUD.
 * @extends DrawableObject
 */
class StatusBarBoss extends DrawableObject {
    /** @type {string[]} Image paths for each fill level of the boss health bar (0 % → 100 %). */
    IMAGES_BAR_BOSS = [
        "img/7_statusbars/2_statusbar_endboss/green/green0.png",
        "img/7_statusbars/2_statusbar_endboss/green/green20.png",
        "img/7_statusbars/2_statusbar_endboss/green/green40.png",
        "img/7_statusbars/2_statusbar_endboss/green/green60.png",
        "img/7_statusbars/2_statusbar_endboss/green/green80.png",
        "img/7_statusbars/2_statusbar_endboss/green/green100.png",
    ];

    /** @type {number} Current boss health percentage (0–100). */
    percentage = 100;

    /**
     * Loads all bar images, sets the initial display to 100 %, and
     * positions the bar on the right side of the HUD.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_BAR_BOSS);
        this.setPercantage(100);
        this.x = 400;
        this.y = -10;
        this.width = 300;
        this.height = 80;
    }

    /**
     * Updates the displayed boss health bar to match the given percentage.
     * @param {number} percentage - Boss health value between 0 and 100.
     */
    setPercantage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_BAR_BOSS[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Maps the current percentage to an index in the `IMAGES_BAR_BOSS` array (0–5).
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
