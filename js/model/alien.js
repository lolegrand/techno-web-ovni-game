export {Alien, AlienFabric};
import {getRandomStrategy} from "./strategy/alienStrategy.js";

class Alien {
    static origAlienWidth = 40;
    static origAlienHeight = 30;
    static alienWidth = 28;
    static alienHeight = 16;

    #destroyingFramePause = 0;
    #framePause = 0;
    #frame = 0;

    get x() {
        return this.xAlien;
    }

    get hitBox() {
        return [this.xAlien, this.yAlien, Alien.alienWidth, Alien.alienHeight];
    }

    constructor(xAlien, yAlien) {
        this.imgAlien = new Image();
        this.imgAlien.src = "./assets/Enemy/HueShifted/eSpritesheet_40x30_hue"+Math.floor(Math.random() * 5)+".png";
        this.xAlien = xAlien;
        this.yAlien = yAlien;
        this.canvas = document.getElementById("canArena");
        this.context = this.canvas.getContext("2d");
        this.status = "Alive";
        this.movementStrategy = getRandomStrategy();
    }

    draw() {
        if (this.status === "Alive") {
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

        if (this.status === "Destroying") {
            let x = this.destroyingFrame % 4;
            let y = Math.floor(this.destroyingFrame / 4);
            this.context.drawImage(
                this.imgAlien,
                64 * x,
                64 * y,
                64,
                64,
                this.xAlien,
                this.yAlien,
                Alien.alienWidth,
                Alien.alienHeight
            );
        }
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

        if (this.status === "Destroying") {
            this.#destroyingFramePause ++;

            if (this.#destroyingFramePause === 5) {
                this.destroyingFrame++;
                this.#destroyingFramePause = 0;
            }
            if (this.destroyingFrame === 16) {
                this.onDestroyed();
                this.status = "Destroyed";
            }
        }
        this.#applyMovement();
    }

    destroy() {
        this.status = "Destroying";
        this.imgAlien.src = "./assets/boom.png";
        this.destroyingFrame = 0;
    }

    #applyMovement() {
        let [movX, movY] = this.movementStrategy.calculateNextStep(this.xAlien, this.yAlien, this.canvas.height);
        this.xAlien += movX;
        this.yAlien += movY;
    }

    onDestroyed() {}
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
