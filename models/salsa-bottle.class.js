class SalsaBottle extends MovableObject{
    width = 100;
    height = 100;
    

     constructor() {
        super().loadImage("img/7_statusbars/3_icons/icon_salsa_bottle.png");
        this.x = 1000 + Math.random() * 3800;
        this.y = 200 + Math.random() * 100;
        
    }
}