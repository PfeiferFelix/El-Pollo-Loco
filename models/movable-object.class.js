class MovableObject extends DrawableObject {

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if(this.isaboveGround() || this.speedY > 0){
         this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }}, 1000 / 25);
    }

    isaboveGround() {
        if (this instanceof ThrowableObject){
            return true;
        }else{
            return this.y < 155;
        }
        
    }

   

    isColliding(movableObject){
        return this.x + this.width > movableObject.x &&
        this.y + this.height > movableObject.y &&
        this.x < movableObject.x + movableObject.width &&
        this.y < movableObject.y + movableObject.height
    }

    moveRight() {
        this.x += this.speed;
        
        
    }

    moveLeft() {
            this.x -= this.speed;
            
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    jump() {
        this.speedY = 15;
    }

    hit(){
        this.energy -= 5; // Damage of the Character
        if(this.energy < 0){
            this.energy = 0;
        }else{
            this.lastHit = new Date().getTime();// so speichert man Zeit in Zahlenform
        }
    }

    isHurt(){
        let timepassed = new Date(). getTime() - this.lastHit; //Diefference in ms
        timepassed = timepassed /1000; // Difference in ms
        return timepassed < 0.5;
    }

    isDead(){
        return this.energy == 0;
    }



}
