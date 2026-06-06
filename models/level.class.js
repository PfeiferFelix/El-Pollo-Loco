class Level {
    clouds;
    coins;
    salsa;
    enemies;
    backgroundObjects;
    level_end_x = 4800;

    constructor(clouds, coins,salsa, enemies, backgroundObjects) {
        this.clouds = clouds;
        this.coins = coins;
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.salsa = salsa;
    }
}
