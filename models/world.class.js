class World {
    character = new Character();
    level = level1;

    ctx;
    canvas;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.ctx = canvas.getContext("2d");
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    //draw() wird immer wieder aufgerufen, damit die Animation flüssig bleibt. requestAnimationFrame sorgt dafür, dass draw() immer dann aufgerufen wird, wenn der Browser bereit ist, den nächsten Frame zu zeichnen. Dadurch wird die Animation effizient und flüssig dargestellt.
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);

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
            this.ctx.save();
            this.ctx.translate(movableObject.width, 0);
            this.ctx.scale(-1, 1);
            movableObject.x = movableObject.x * -1;
        }
        this.ctx.drawImage(
            movableObject.img,
            movableObject.x,
            movableObject.y,
            movableObject.width,
            movableObject.height,
        );
        if (movableObject.otherDirection) {
            this.ctx.restore();
            movableObject.x = movableObject.x * -1;
        }
    }
}
