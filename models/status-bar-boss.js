class StatusBarBoss extends DrawableObject{

    IMAGES_BAR_BOSS = [
        "img/7_statusbars/2_statusbar_endboss/green/green0.png",
        "img/7_statusbars/2_statusbar_endboss/green/green20.png",
        "img/7_statusbars/2_statusbar_endboss/green/green40.png",
        "img/7_statusbars/2_statusbar_endboss/green/green60.png",
        "img/7_statusbars/2_statusbar_endboss/green/green80.png",
        "img/7_statusbars/2_statusbar_endboss/green/green100.png",
    ];
    percentage = 100;


    constructor(){
        super();
        this.loadImages(this.IMAGES_BAR_BOSS);
        this.setPercantage(100);
        this.x = 400;
        this.y = -10;
        this.width = 300;
        this.height = 80;
    }

    setPercantage(percentage){
        this.percentage = percentage;
        let path = this.IMAGES_BAR_BOSS[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex(){
        if (this.percentage == 100){
            return 5;
        }else if (this.percentage >= 80){
            return 4;
        }else if (this.percentage >= 60){
            return 3;
        }else if (this.percentage >= 40){
            return 2;
        } else if (this.percentage >= 20){
            return 1;
        }else
            return 0;
    }
}