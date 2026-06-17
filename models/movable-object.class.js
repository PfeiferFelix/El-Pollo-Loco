class MovableObject extends DrawableObject {

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isaboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } if (this instanceof ThrowableObject && this.y > this.groundY) {

                clearInterval(this.ThrowIntervall);
                clearInterval(this.animateInterval);
                this.speedY = 0;
                if (!this.splashSoundPlayed) {
                    this.splashSoundPlayed = true;
                    this.world.audio_splash_bottle.currentTime = 0;
                    this.world.audio_splash_bottle.play();
                }
                this.playAnimation(this.BOTTLE_SPLASH);
                if (this.currentImage >= this.BOTTLE_SPLASH.length) {
                    this.world.throwableObject = this.world.throwableObject.filter(bottle => bottle !== this);
                }
            }

        }, 1000 / 25);

    }

    isaboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y <= this.groundY;
        } else {
            return this.y < 150;
        }
    }



    isColliding(movableObject) {
        return this.x + this.width > movableObject.x &&
            this.y + this.height > movableObject.y &&
            this.x < movableObject.x + movableObject.width &&
            this.y < movableObject.y + movableObject.height
    }

    isJumpingOnTop(enemy){
        return this.speedY < 0 &&
            this.isColliding(enemy)&& this.y + this.height < enemy.y +45;

    }

    moveRight() {
        this.x += this.speed;


    }

    moveLeft() {
        this.x -= this.speed;

    }

    playAnimation(images) {
        if (this.currentAnimation !== images) {
            this.currentImage = 0;
            this.currentAnimation = images;
        }
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    playAnimationOnce(images) {
        if (this.currentAnimation !== images) {
            this.currentImage = 0;
            this.currentAnimation = images;
        }
        if (this.currentImage < images.length) {
            this.img = this.imageCache[images[this.currentImage]];
            this.currentImage++;
        }
    }
    jump() {
        this.speedY = 15;
    }

    hit() {
        this.energy -= 5; // Damage of the Character
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();// so speichert man Zeit in Zahlenform
        }
        if (this.isDead){
            return;
            
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; //Diefference in ms
        timepassed = timepassed / 1000; // Difference in ms
        return timepassed < 0.3;
    }

    isDead() {
        return this.energy == 0;
          
    }



}
