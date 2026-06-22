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
    audio_you_lost = new Audio("audio/you_lost.mp3");
    audio_hurt = new Audio("audio/pepe_hurt.mp3");



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
        setInterval(() => this.handleMovement(), 1000 / 60);
        setInterval(() => this.playAnimationState(), 80);
    }

    handleMovement() {
        if (this.isDead() || (this.world.endboss && this.world.endboss.isDead())) return;
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.lastActionTime = Date.now();
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.lastActionTime = Date.now();
        }
        this.handleJumpAndCamera();
    }

    handleJumpAndCamera() {
        if ((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isaboveGround()) {
            this.jump();
            this.lastActionTime = Date.now();
        }
        if (this.world.keyboard.D) {
            this.lastActionTime = Date.now();
        }
        this.world.camera_x = -this.x + 80;
    }

    playAnimationState() {
        if (this.isDead()) {
            this.handleDead();
        } else if (this.world.endboss && this.world.endboss.isDead()) {
            this.stopAmbientAudio();
        } else if (this.isHurt()) {
            this.hurtAudio();
            this.handleHurt();
        } else if (this.isaboveGround() || this.speedY > 0) {
            this.handleAboveGround();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.handleWalking();
        } else if (Date.now() - this.lastActionTime > 15000) {
            this.handleLongIdle();
        } else {
            this.handleIdle();
        }
        if (!this.isHurt()) {
            this.audio_hurtPlayed = false;
        }
    }

    handleDead() {
        this.playAnimationOnce(this.IMAGES_DEAD);
        this.audio_snoring.pause();
        this.audio_snoring.currentTime = 0;
        if (!this.audio_you_lostPlayed) {
            this.audio_you_lostPlayed = true;
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            if (!soundsMuted) this.audio_you_lost.play();
            setTimeout(() => showGameOver(), 1500);
        }
    }

    handleHurt() {
        this.playAnimation(this.IMAGES_HURT);
        this.stopAmbientAudio();
    }

    handleAboveGround() {
        this.playAnimationOnce(this.IMAGES_JUMPING);
        this.stopAmbientAudio();
    }

    handleWalking() {
        this.playAnimation(this.IMAGES_WALKING);
        this.stopAmbientAudio();
    }

    handleLongIdle() {
        this.playAnimation(this.IMAGES_LONG_IDLE);
        if (!soundsMuted) this.audio_snoring.play();
        this.audio_you_lost.pause();
        this.audio_you_lost.currentTime = 0;
    }

    handleIdle() {
        this.playAnimation(this.IMAGES_IDLE);
        this.stopAmbientAudio();
    }

    stopAmbientAudio() {
        this.audio_snoring.pause();
        this.audio_snoring.currentTime = 0;
        this.audio_you_lost.pause();
        this.audio_you_lost.currentTime = 0;
    }

    jump() {
        this.speedY = 16;
    }


     hurtAudio(){
        if (this.isHurt()){
            if (!this.audio_hurtPlayed){
                this.audio_hurtPlayed = true;
                if (!soundsMuted) this.audio_hurt.play();
            }
        }
    }
}
