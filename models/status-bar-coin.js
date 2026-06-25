/**
 * HUD element that displays the player's collected coin count as a segmented bar.
 * The bar image is updated in six steps (0 / 20 / 40 / 60 / 80 / 100 %).
 * @extends DrawableObject
 */
class StatusBarCoin extends DrawableObject {
    /** @type {string[]} Image paths for each fill level of the coin bar (0 % → 100 %). */
    IMAGES_COIN = [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    ];

    /** @type {number} Current coin percentage (0–100). */
    percentage = 0;

    /**
     * Loads all bar images, sets the initial display to 0 %, and
     * positions the bar below the health bar in the HUD.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_COIN);
        this.setPercantage(0);
        this.x = 10;
        this.y = 40;
        this.width = 300;
        this.height = 80;
    }

    /**
     * Updates the displayed coin bar to match the given percentage.
     * @param {number} percentage - Coin fill value between 0 and 100.
     */
    setPercantage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_COIN[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Maps the current percentage to an index in the `IMAGES_COIN` array (0–5).
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
