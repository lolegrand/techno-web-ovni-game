export {Laser};

class Laser {
    static #heightLaser = 5;
    static #widthLaser = 10;

    get x() {
        return this.xLaser;
    }

    get hitBox() {
        return [this.xLaser, this.yLaser, Laser.#widthLaser, Laser.#heightLaser];
    }

    constructor(yLaser, xLaser) {
        this.yLaser = yLaser;
        this.xLaser = xLaser;
        this.context = document.getElementById("canArena").getContext("2d");
    }

    update() {
        this.xLaser += 2;
    }

    draw() {
        this.context.fillStyle = "red";
        this.context.fillRect(
            this.xLaser,
            this.yLaser,
            Laser.#widthLaser,
            Laser.#heightLaser
        );
    }

    clear() {
        this.context.clearRect(
            this.xLaser,
            this.yLaser,
            this.xLaser + Laser.#widthLaser,
            this.yLaser + Laser.#heightLaser
        );
    }
}