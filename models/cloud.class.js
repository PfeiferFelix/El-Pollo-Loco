class Cloud extends MovableObject {
    width = 400;
    height = 300;
    y = 5;

    constructor() {
        super().loadImage("img/5_background/layers/4_clouds/2.png");
        this.x = 0 + Math.random() * 3000; // Zufällige Position zwischen 200 und 700
        this.animate();
    }

    animate() {
        this.moveLeft();
    }
}
