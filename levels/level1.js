/**
 * Creates and returns the configuration for Level 1.
 *
 * The level spans 8 background segments (each 719px wide), resulting in a
 * total scrollable width of 719 × 8 = 5752px. Background layers are rendered
 * using a parallax technique: air, third layer, second layer, and first layer
 * are stacked per segment. Alternating images (1.png / 2.png) create a
 * seamless tile loop.
 *
 * @returns {Level} A fully configured Level instance containing:
 *   - 10 {@link Cloud} objects for the sky
 *   - 5 {@link Coin} collectibles
 *   - 5 {@link SalsaBottle} throwable items
 *   - 4 {@link Chicken} enemies, 4 {@link ChickenSmall} enemies, and 1 {@link Endboss}
 *   - 32 {@link BackgroundObject} instances forming 8 parallax segments
 */
function createLevel1() {
    return new Level(
        [
            /**
             * clouds
             */
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
        ],

        
        /**
         * coins
         */
        [new Coin(), new Coin(), new Coin(), new Coin(), new Coin()],


         /**
         * salsa bottle
         */
        [
            new SalsaBottle(),
            new SalsaBottle(),
            new SalsaBottle(),
            new SalsaBottle(),
            new SalsaBottle(),
        ],


        /**
         * enemies
         */
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new ChickenSmall(),
            new ChickenSmall(),
            new ChickenSmall(),
            new ChickenSmall(),
            new Endboss(),
        ],


         /**
         * Background objects (8 parallax segments × 4 layers each)
         */
        [
            // Segment 0 — x: -719 (pre-scroll buffer)
            new BackgroundObject("img/5_background/layers/air.png", -719),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),

            // Segment 1 — x: 0
            new BackgroundObject("img/5_background/layers/air.png", 0),
            new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
            new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
            new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

            // Segment 2 — x: 719
            new BackgroundObject("img/5_background/layers/air.png", 719),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),

            // Segment 3 — x: 719 * 2
            new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
            new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
            new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
            new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),

            // Segment 4 — x: 719 * 3
            new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),

            // Segment 5 — x: 719 * 4
            new BackgroundObject("img/5_background/layers/air.png", 719 * 4),
            new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 4),
            new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 4),
            new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 4),

            // Segment 6 — x: 719 * 5
            new BackgroundObject("img/5_background/layers/air.png", 719 * 5),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 5),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 5),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 5),

            // Segment 7 — x: 719 * 6
            new BackgroundObject("img/5_background/layers/air.png", 719 * 6),
            new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 6),
            new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 6),
            new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 6),

            // Segment 8 — x: 719 * 7 (Endboss arena)
            new BackgroundObject("img/5_background/layers/air.png", 719 * 7),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 7),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 7),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 7),
        ],
    );
}
