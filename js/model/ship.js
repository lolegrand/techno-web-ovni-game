export {Ship}
import {Laser} from "./laser.js"

class Ship {
    static #xShip = 10;
    static #yShipSpeed = 2;
    static #shipHeight = 16;
    static #shipWidth = 32;
    static #shipImgHeight = 29;
    static #shipImgWidth = 64;

    #frame = 0;
    #goUp = false;
    #goDown = false;

    get hitBox() {
        return [Ship.#xShip, this.yShip, Ship.#shipWidth, Ship.#shipHeight];
    }

    constructor() {
        this.imgShip = new Image();
        this.imgShip.src = "./assets/Ship/f1.png";
        this.yShip = 100;
        this.canvas = document.getElementById("canArena");
        this.context = this.canvas.getContext("2d");
        window.addEventListener("keyup", (e) => this.#onKeyUp(e), true);
        window.addEventListener("keydown", (e) => this.#onKeyDown(e), true);
    }

    update() {
        this.#frame = (this.#frame + 1) % 12;
        switch (this.#frame) {
            case 0:
                this.imgShip.src = "./assets/Ship/f1.png";
                break;
            case 3:
                this.imgShip.src = "./assets/Ship/f2.png";
                break;
            case 7:
                this.imgShip.src = "./assets/Ship/f3.png";
                break;
            case 11:
                this.imgShip.src = "./assets/Ship/f4.png";
                break;
            default:
        }

        if (this.#goUp) {
            if (this.yShip <= 0) {
                return;
            }
            this.yShip =  this.yShip - Ship.#yShipSpeed;
        }
        if (this.#goDown) {
            if (this.yShip >= this.canvas.height - Ship.#shipHeight) {
                return;
            }
            this.yShip =  this.yShip + Ship.#yShipSpeed;
        }
    }

    draw() {
        this.context.drawImage(
            this.imgShip,
            0,
            0,
            Ship.#shipImgWidth,
            Ship.#shipImgHeight,
            Ship.#xShip,
            this.yShip,
            Ship.#shipWidth,
            Ship.#shipHeight
        );
    }

    clear() {
        this.context.clearRect(Ship.#xShip, this.yShip, Ship.#shipWidth, Ship.#shipHeight);
    }

    onShoot(laser) {}

    #onKeyDown(event) {
        if (event.key === "ArrowDown") {
            this.#goDown = true;
        }
        if (event.key === "ArrowUp") {
            this.#goUp = true;
        }
        if (event.key === " ") {
            this.onShoot(new Laser(this.yShip + Ship.#shipHeight / 4 , Ship.#xShip + Ship.#shipWidth));
        }
    }

    #onKeyUp(event) {
        if (event.key === "ArrowDown") {
            this.#goDown = false;
        }

        if (event.key === "ArrowUp") {
            this.#goUp = false;
        }
    }
}
