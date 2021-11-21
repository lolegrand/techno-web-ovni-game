export {getRandomStrategy};

const numberOfStrategy = 3;

function getRandomStrategy() {
    const val = Math.floor(Math.random() * numberOfStrategy);

    switch (val) {
        case 0 : return new LinearStrategy();
        case 1 : return new AngularStrategy();
        case 2 : return new SonicStrategy();
    }

}

class LinearStrategy {
    calculateNextStep(posX, posY, canvasHeight) {
        return [-1, 0];
    }
}

class AngularStrategy {
    direction = -1;
    calculateNextStep(posX, posY, canvasHeight) {
        if (posY <= 0) {
            this.direction = 1;
        }
        if (posY >= canvasHeight) {
            this.direction = -1;
        }
        return [-1, this.direction];
    }
}

class SonicStrategy {
    calculateNextStep(posX, posY, canvasHeight) {
        return [-10, 0];
    }
}
