class ThrowableObject extends MovableObject {
  THROW_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",

  ];

  BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.THROW_BOTTLE);
    this.loadImages(this.BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.groundY = 350;
    this.height = 100;
    this.width = 80;
    this.throw();
  }

  animate() {
    this.animateInterval = setInterval(() => {
      this.playAnimation(this.THROW_BOTTLE);
    }, 100);
  }

  throw() {
    this.speedY = 10; //Bogen desto größer derso höher der Bogen der die Flasche fliegt
    this.applyGravity();
    let distance = 0; //Startwert
    this.ThrowIntervall = setInterval(() => {
      this.x += 10; //geschwindigkeit dersto höher desto schneller nach rechts
      distance += 5;
      if (distance >= 500) { //Wie weit die Flasche fliegt
        clearInterval(this.ThrowIntervall);

      }
    }, 25);
    this.animate();
  }


}
