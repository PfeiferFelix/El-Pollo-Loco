class ThrowableObject extends MovableObject{
    THROW_BOTTLE = [
        "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];

    constructor(x, y){
        super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
        this.loadImages(this.THROW_BOTTLE);
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 80;
        this.throw();
        this.animate();
   }

    animate(){
        setInterval(() => {
            this.playAnimation(this.THROW_BOTTLE);
        }, 100);
    }

    throw(){
        this.speedY = 5;
        this.applyGravity();
        setInterval(() => {
            this.x += 60;
        }, 60);
    }

}