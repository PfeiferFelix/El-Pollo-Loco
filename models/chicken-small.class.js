class ChickenSmall extends MovableObject {
    height = 100;
    width = 90;
    y = 330;
    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ];
    IMAGES_DEAD = [
        "img/3_enemies_chicken/chicken_small/2_dead/dead.png",
    ];

    audio_splash = new Audio("audio/chicken_small_splash.mp3");

    constructor() {
        super().loadImage(
            "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        );
        this.x = 300 + Math.random() * 4800; // Zufällige Position zwischen 200 und 700
        this.speed = 0.15 + Math.random() * 0.5; // Zufällige Geschwindigkeit zwischen 0.15 und 0.65
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

      hit() {
        this.energy = 0;
    }

    animate() {
        let animationInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            
            if (this.isDead()) {
                this.deadAudio();
                this.playAnimation(this.IMAGES_DEAD);
                this.y = 330;
                clearInterval(animationInterval);
                return;
            }else{this.playAnimation(this.IMAGES_WALKING);
            }
            this.audio_splashPlayed = false;
        }, 100);
    }
       deadAudio(){
        if (this.isDead){
            if (!this.audio_splashPlayed){
                this.audio_splashPlayed = true;
                if (!soundsMuted) this.audio_splash.play();
            }
        }
    }
}