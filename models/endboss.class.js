class Endboss extends MovableObject {
    height = 400;
    width = 300;
    y = 50;

    IMAGES_ALERT = [
        "img/4_enemie_boss_chicken/2_alert/G5.png",
        "img/4_enemie_boss_chicken/2_alert/G6.png",
        "img/4_enemie_boss_chicken/2_alert/G7.png",
        "img/4_enemie_boss_chicken/2_alert/G8.png",
        "img/4_enemie_boss_chicken/2_alert/G9.png",
        "img/4_enemie_boss_chicken/2_alert/G10.png",
        "img/4_enemie_boss_chicken/2_alert/G11.png",
        "img/4_enemie_boss_chicken/2_alert/G12.png",
    ]

    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/1_walk/G1.png",
        "img/4_enemie_boss_chicken/1_walk/G2.png",
        "img/4_enemie_boss_chicken/1_walk/G3.png",
        "img/4_enemie_boss_chicken/1_walk/G4.png",
    ];

    constructor() {
        super().loadImage("img/4_enemie_boss_chicken/2_alert/G5.png");
        this.speed = 0.15
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.x = 4800;
        this.animate();
    }

    animate() {
         setInterval(() => {
            if(this.character.x >= 3000){
                this.playAnimation(this.IMAGES_WALKING);
            }else {
                this.playAnimation(this.IMAGES_ALERT);
            }
        }, 200);
         setInterval(() => {
            if(this.character.x >= 3000){
                this.moveLeft();
            }
        }, 1000 / 60);
    }



    
}
