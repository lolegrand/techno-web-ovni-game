export {Alien, AlienFabric};

class Alien {
    static origAlienWidth = 40;
    static origAlienHeight = 30;
    static alienWidth = 28;
    static alienHeight = 16;

    #framePause = 0;
    #frame = 0;

    get x() {
        return this.xAlien;
    }

    constructor(xAlien, yAlien) {
        this.imgAlien = new Image();
        this.imgAlien.src = "./assets/Enemy/HueShifted/eSpritesheet_40x30_hue"+Math.floor(Math.random() * 5)+".png";
        this.xAlien = xAlien;
        this.yAlien = yAlien;
        this.context = document.getElementById("canArena").getContext("2d");
    }

    draw() {
        this.context.drawImage(
            this.imgAlien,
            0,
            Alien.origAlienHeight * this.#frame,
            Alien.origAlienWidth,
            Alien.origAlienHeight,
            this.xAlien,
            this.yAlien,
            Alien.alienWidth,
            Alien.alienHeight
        );
    }

    clear() {
        this.context.clearRect(
            this.xAlien,
            this.yAlien,
            Alien.alienWidth,
            Alien.alienHeight
        );
    }

    update() {
        this.#framePause ++;
        if (this.#framePause === 5) {
            this.#frame = (this.#frame + 1) % 6;
            this.#framePause = 0;
        }
        this.#calculateMovement();
    }

    #calculateMovement() {
        this.xAlien --;
    }

}

class AlienFabric {
    static #TimeToCreate = 30;
    #counter = 0;
    #canvas = document.getElementById("canArena");

    onCreateAlien(alien) {};

    update() {
        this.#counter ++;
        if (this.#counter >= AlienFabric.#TimeToCreate) {
            this.onCreateAlien(
                new Alien(this.#canvas.width, Math.floor(Math.random() * (this.#canvas.height - Alien.alienHeight)))
            );
            this.#counter = 0;
        }
    };
}
