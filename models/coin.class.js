class Coin extends MovableObject{
    width = 100;
    height = 100;
    

     constructor() {
        super().loadImage("img/8_coin/coin_1.png");
        this.x = 0 + Math.random() * 3800; // Zufällige Position zwischen 200 und 700 auf der X achse
        this.y = 200 + Math.random() * 100
        
    }
}