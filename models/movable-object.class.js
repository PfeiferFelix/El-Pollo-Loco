class MovableObject {
    x = 100;
    y = 255;
    img;
    height = 170;
    width = 130;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;

    applyGravity() {
        setInterval(() => {
            if(this.isaboveGround() || this.speedY > 0){
         this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }}, 1000 / 25);
    }

    isaboveGround() {
        return this.y < 155;
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx){
           ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height,
        );
    }

    drawFrame(ctx){
        if(this instanceof Character || this instanceof Chicken){
         ctx.beginPath();
        ctx.lineWidth = "5";
        ctx.strokeStyle = "blue";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        }
    }


    isColliding(movableObject){
        return this.x + this.width > movableObject.x &&
        this.y + this.height > movableObject.y &&
        this.x < movableObject.x &&
        this.y < movableObject.y + movableObject.height
    }



    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
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





}
