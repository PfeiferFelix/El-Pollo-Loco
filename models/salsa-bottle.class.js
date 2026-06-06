class SalsaBottle extends MovableObject{
    width = 100;
    height = 100;
    

     constructor() {
        super().loadImage("img/7_statusbars/3_icons/icon_salsa_bottle.png");
        this.x = 0 + Math.random() * 3800; // Zufällige Position zwischen 200 und 700 auf der X achse
        this.y = 200 + Math.random() * 100
        
    }
}