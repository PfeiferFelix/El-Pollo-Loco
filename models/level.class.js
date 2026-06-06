class Level {
    clouds;
    coins;
    enemies;
    backgroundObjects;
    level_end_x = 4800;

    constructor(clouds, coins, enemies, backgroundObjects) {
        this.clouds = clouds;
        this.coins = coins;
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
    }
}
