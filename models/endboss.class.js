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

    IMAGES_HURT = [
        "img/4_enemie_boss_chicken/4_hurt/G21.png",
        "img/4_enemie_boss_chicken/4_hurt/G22.png",
        "img/4_enemie_boss_chicken/4_hurt/G23.png",
    ];

    IMAGES_DEAD = [
        "img/4_enemie_boss_chicken/5_dead/G24.png",
        "img/4_enemie_boss_chicken/5_dead/G25.png",
        "img/4_enemie_boss_chicken/5_dead/G26.png",
    ];

    IMAGES_ATTACK = [
        "img/4_enemie_boss_chicken/3_attack/G13.png",
        "img/4_enemie_boss_chicken/3_attack/G14.png",
        "img/4_enemie_boss_chicken/3_attack/G15.png",
        "img/4_enemie_boss_chicken/3_attack/G16.png",
        "img/4_enemie_boss_chicken/3_attack/G17.png",
        "img/4_enemie_boss_chicken/3_attack/G18.png",
        "img/4_enemie_boss_chicken/3_attack/G19.png",
        "img/4_enemie_boss_chicken/3_attack/G20.png",
    ];


    constructor() {
        super().loadImage("img/4_enemie_boss_chicken/2_alert/G5.png");
        this.speed = 0.15;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = 4800;
        this.isAlerted = false;
        this.alertFinished = false;
        this.hasJumped = false;
        this.isJumping = false;
        this.animate();
    }

    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    animate() {
        this.animationInterval = setInterval(() => this.playStateAnimation(), 200);
        this.moveInterval = setInterval(() => {
            if (this.alertFinished && !this.isDead() && this.CharacterIsNotInSight()) this.moveLeft();
        }, 1000 / 60);
    }

    playStateAnimation() {
        if (this.isDead()) {
            this.handleDead();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (!this.isAlerted) {
            this.handleWalking();
        } else if (!this.alertFinished) {
            this.playAnimation(this.IMAGES_ALERT);
        } else if (this.CharacterIsNotInSight()) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.handleAttack();
        }
    }

    handleDead() {
        this.playAnimation(this.IMAGES_DEAD);
        this.y = 80;
        clearInterval(this.animationInterval);
        clearInterval(this.moveInterval);
    }

    handleWalking() {
        this.playAnimation(this.IMAGES_WALKING);
        if (this.isCharacterInSight()) {
            this.isAlerted = true;
            setTimeout(() => { this.alertFinished = true; }, this.IMAGES_ALERT.length * 200);
        }
    }

    handleAttack() {
        this.playAnimation(this.IMAGES_ATTACK);
        if (!this.hasJumped) {
            this.hasJumped = true;
            this.currentImage = 0;
            setTimeout(() => {
                this.jumpVorwoard();
                setInterval(() => {
                    if (!this.CharacterIsNotInSight()) this.jumpVorwoard();
                }, this.IMAGES_ATTACK.length * 200);
            }, 1000);
        }
    }

    isCharacterInSight() {
        let distance = this.x - this.character.x;
        return distance < 300;
    }
    CharacterIsNotInSight() {
        let distance = this.x - this.character.x;
        return distance >= 300;
    }

    jumpVorwoard() {
        this.isJumping = true;
        let distance = 0;
        let jumpVorwoardInterval = setInterval(() => {
            if (!this.CharacterIsNotInSight()) {
                this.x -= 10;
            }
            distance += 5;
            if (distance <= 60) {
                this.y -= 5;
            } else {
                this.y += 5;
            }
            if (distance >= 120) {
                clearInterval(jumpVorwoardInterval);
                this.y = 50;
                this.isJumping = false;
            }
        }, 25);
    }
}
