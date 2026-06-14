class Character extends MovableObject {
    height = 280;
    width = 150;
    y = 150;
    speed = 10;
    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png",
    ];

    IMAGES_JUMPING = [
        "img/2_character_pepe/3_jump/J-31.png",
        "img/2_character_pepe/3_jump/J-32.png",
        "img/2_character_pepe/3_jump/J-33.png",
        "img/2_character_pepe/3_jump/J-34.png",
        "img/2_character_pepe/3_jump/J-35.png",
        "img/2_character_pepe/3_jump/J-36.png",
    ];

    IMAGES_DEAD = [
        "img/2_character_pepe/5_dead/D-51.png",
        "img/2_character_pepe/5_dead/D-52.png",
        "img/2_character_pepe/5_dead/D-53.png",
        "img/2_character_pepe/5_dead/D-54.png",
        "img/2_character_pepe/5_dead/D-55.png",
        "img/2_character_pepe/5_dead/D-56.png",
        "img/2_character_pepe/5_dead/D-57.png",
    ];

    IMAGES_HURT = [
        "img/2_character_pepe/4_hurt/H-41.png",
        "img/2_character_pepe/4_hurt/H-42.png",
        "img/2_character_pepe/4_hurt/H-43.png",
    ];

    IMAGES_IDLE = [
        "img/2_character_pepe/1_idle/idle/I-1.png",
        "img/2_character_pepe/1_idle/idle/I-2.png",
        "img/2_character_pepe/1_idle/idle/I-3.png",
        "img/2_character_pepe/1_idle/idle/I-4.png",
        "img/2_character_pepe/1_idle/idle/I-5.png",
        "img/2_character_pepe/1_idle/idle/I-6.png",
        "img/2_character_pepe/1_idle/idle/I-7.png",
        "img/2_character_pepe/1_idle/idle/I-8.png",
        "img/2_character_pepe/1_idle/idle/I-9.png",
        "img/2_character_pepe/1_idle/idle/I-10.png",
    ];

    IMAGES_LONG_IDLE = [
        "img/2_character_pepe/1_idle/long_idle/I-11.png",
        "img/2_character_pepe/1_idle/long_idle/I-12.png",
        "img/2_character_pepe/1_idle/long_idle/I-13.png",
        "img/2_character_pepe/1_idle/long_idle/I-14.png",
        "img/2_character_pepe/1_idle/long_idle/I-15.png",
        "img/2_character_pepe/1_idle/long_idle/I-16.png",
        "img/2_character_pepe/1_idle/long_idle/I-17.png",
        "img/2_character_pepe/1_idle/long_idle/I-18.png",
        "img/2_character_pepe/1_idle/long_idle/I-19.png",
        "img/2_character_pepe/1_idle/long_idle/I-20.png",
    ];
    audio_snoring = new Audio("audio/snoring.mp3");



    world;
    currentImage = 0;
    lastActionTime = Date.now();

    constructor() {
        super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.animate();
        this.applyGravity();
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT &&
                this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                this.lastActionTime = Date.now();
            }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                this.lastActionTime = Date.now();
            }
            if ((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isaboveGround()) {
                this.jump();
                this.lastActionTime = Date.now();
            }
            if (this.world.keyboard.D) {
                this.lastActionTime = Date.now();
            }

            this.world.camera_x = -this.x + 80;
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                console.log("dead");
                this.playAnimationOnce(this.IMAGES_DEAD);
                this.moveLeft = false;
                this.moveRight = false;
                this.jump = false;
                this.collectCoins = false;
                this.collectSalsa = false
                this.audio_snoring.pause();
                this.audio_snoring.currentTime = 0;
            } else if (this.isHurt()) {
                console.log("hurt");
                this.playAnimation(this.IMAGES_HURT);
               this.audio_snoring.pause();
               this.audio_snoring.currentTime = 0;
            } else if (this.isaboveGround() || this.speedY > 0) {
                console.log("jumping");
                this.playAnimationOnce(this.IMAGES_JUMPING);
                  this.audio_snoring.pause();
               this.audio_snoring.currentTime = 0;
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                console.log("walking");
                this.playAnimation(this.IMAGES_WALKING);
                  this.audio_snoring.pause();
               this.audio_snoring.currentTime = 0;
            } else if (Date.now() - this.lastActionTime > 3000) {
                console.log("long idle");
                this.playAnimation(this.IMAGES_LONG_IDLE);
                this.audio_snoringPlayed = true;

                this.audio_snoring.play();
            } else {
                console.log("idle");
                this.playAnimation(this.IMAGES_IDLE);
                  this.audio_snoring.pause();
               this.audio_snoring.currentTime = 0;
            }
        }, 80);
    }


    jump() {
        this.speedY = 16;
    }
}
