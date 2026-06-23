class Coin extends MovableObject{
    width = 100;
    height = 100;
    

     constructor() {
        super().loadImage("img/8_coin/coin_1.png");
        this.x = 1000 + Math.random() * 3800;
        this.y = 200 + Math.random() * 100;
        
    }
}