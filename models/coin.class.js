class Coin extends MovableObject{
    width = 100;
    height = 100;
    y = 300;

     constructor() {
        super().loadImage("img/8_coin/coin_1.png");
        this.x = 0 + Math.random() * 3000; // Zufällige Position zwischen 200 und 700 auf der X achse
        this.y = 0 + Math.random() * 300
        
    }
}