class World {
    character = new Character();
    level = createLevel1();
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    statusBarCoin = new StatusBarCoin();
    statusBarSalsa = new StatusBarSalsa();
    statusBarBoss = new StatusBarBoss();
    throwableObject = [];
    coins = 0;
    salsa = 0;
    bottleThrown = false;
    audio_splash_bottle = new Audio ("audio/glass_bottle_splash.mp3");
    audio_collect_coin = new Audio("audio/collect_coin.mp3");

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.ctx = canvas.getContext("2d");
        this.draw();
        this.setWorld();
        this.run();

    }

    setWorld() {
        this.character.world = this;
        this.endboss = this.level.enemies.find(e => e instanceof Endboss);
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                enemy.character = this.character;
            }
        });
    }

    run() {
        setInterval(() => {
            this.checkcolissions();
            this.checkThrowObjects();
            this.collectCoins();
            this.collectSalsa();
        }, 1000 / 60);
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.salsa > 0 && !this.bottleThrown) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObject.push(bottle);
            bottle.world = this

            this.salsa--;
            this.bottleThrown = true;
            let percentage = (this.salsa / 5) * 100;
            this.statusBarSalsa.setPercantage(percentage);
        }
        if (!this.keyboard.D) {
            this.bottleThrown = false;
        }
    }

    checkcolissions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !this.character.isDead() && !this.character.isHurt() && !this.character.isJumpingOnTop(enemy) && !enemy.isDead()) {
                this.character.hit();
                this.statusBar.setPercantage(this.character.energy);
            }
        });
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss) {
            this.throwableObject = this.throwableObject.filter((bottle) => {
                if (endboss.isColliding(bottle)) {
                    endboss.hit();
                    this.statusBarBoss.setPercantage(endboss.energy);
                    if (!soundsMuted) this.audio_splash_bottle.play();
                    return false;
                }
                return true;
            });
        }
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
                this.throwableObject = this.throwableObject.filter((bottle) => {
                    if (enemy.isColliding(bottle) && !enemy.isDead()) {
                        enemy.hit();
                        if (!soundsMuted) this.audio_splash_bottle.play();
                        return false;
                        
                    }
                    return true;
                    
                });
            }
            if (this.character.isJumpingOnTop(enemy) && !enemy.isDead()) {
                enemy.hit();
                this.character.speedY = 8; 
                return;
            }
        });
    }
    collectCoins() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1)
                this.audio_collect_coin.currentTime = 0;
                if (!soundsMuted) this.audio_collect_coin.play();
                if (this.coins < 5) {
                    this.coins++;
                }
                let percentage = (this.coins / 5) * 100 //5 coins is 100%
                this.statusBarCoin.setPercantage(percentage);
            }

        })
    }

    collectSalsa() {
        this.level.salsa.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.salsa.splice(index, 1)
                if (this.salsa < 5) {
                    this.salsa++;
                }
                let percentage = (this.salsa / 5) * 100 //5 bottles is 100%
                this.statusBarSalsa.setPercantage(percentage);
            }

        })
    }








    //draw() wird immer wieder aufgerufen, damit die Animation flüssig bleibt. requestAnimationFrame sorgt dafür, dass draw() immer dann aufgerufen wird, wenn der Browser bereit ist, den nächsten Frame zu zeichnen. Dadurch wird die Animation effizient und flüssig dargestellt.
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);//back
        // -----Space for fixed Objects----
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarSalsa);
        this.addToMap(this.statusBarBoss);
        this.ctx.translate(this.camera_x, 0); // Forwards

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.salsa);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObject);




        this.ctx.translate(-this.camera_x, 0);


        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
    }

    addToMap(movableObject) {
        if (movableObject.otherDirection) {
            this.flipImage(movableObject);
        }
        movableObject.draw(this.ctx);
        movableObject.drawFrame(this.ctx);

        if (movableObject.otherDirection) {
            this.flipImageBack(movableObject);
        }
    }




    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    flipImageBack(movableObject) {
        this.ctx.restore();
        movableObject.x = movableObject.x * -1;
    }

}
