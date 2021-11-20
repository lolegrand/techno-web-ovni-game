import { Ship } from "./model/ship.js";
import { AlienFabric } from "./model/alien.js";

const animFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    null;

//Canvas
let divArena;
let canArena;
let conArena;
let ArenaWidth = 500;
let ArenaHeight = 300;

//Background
let xBackgroundOffset = 0;
const xBackgroundSpeed = 1;
const backgroundWidth = 1782;
const backgroundHeight = 600;

function manageHitBetweenObject(object1, object2) {
    let [x1,y1,w1,h1] = object1;
    let [x2,y2,w2,h2] = object2;
    if (x1 !== x2) {
        if (x1 <= x2 && (x1 + w1) < x2) {
            return false;
        }
        if (x1 >= x2 && x1 > (x2 + w2)) {
            return false;
        }
    }
    if (y1 !== y2) {
        if (y1 <= y2 && (y1 + h1) < y2) {
            return false;
        }
        if (y1 >= y2 && y1 > (y2 + h2)) {
            return false;
        }
    }
    return true;
}

function hitBoxManagement(aliens, lasers, ship) {
    aliens.map((a) => {
        for (const l of lasers) {
            if (manageHitBetweenObject(a.hitBox, l.hitBox)) {
                if (a.status !== "Destroying")
                    a.destroy();
            }
        }
    });
    lasers = lasers.filter((l) => {
        for (const a of aliens) {
            if (manageHitBetweenObject(l.hitBox, a.hitBox))   {
                if (a.status !== "Destroying")
                    return false;
            }
        }
        return true;
    });
    aliens.forEach((a) => {
        if (manageHitBetweenObject(a.hitBox, ship.hitBox) && a.status === "Alive") {
            console.log("You loose");
        }
    })
}

function updateScene() {
    "use strict";
    xBackgroundOffset = (xBackgroundOffset - xBackgroundSpeed) % backgroundWidth;
}

function drawScene() {
    "use strict";
    canArena.style.backgroundPosition = xBackgroundOffset + "px 0px" ;
}

function updateGame() {
    updateScene();
    ship.update();
    lasers.map((l) => l.update());
    if (lasers.length !== 0) {
        lasers = lasers.filter((l) => l.x <= canArena.width);
    }
    aliens.map((a) => a.update());
    if (aliens.length !== 0) {
        aliens = aliens.filter((a) => a.x >= -30);
        aliens = aliens.filter((a) => a.status === "Alive" || a.status === "Destroying");
    }
    alienFabric.update();
    hitBoxManagement(aliens, lasers, ship);
}

function drawGame() {
    drawScene();
    ship.draw();
    lasers.map((l) => l.draw());
    aliens.map((a) => a.draw());
}

function clearGame() {
    ship.clear();
    lasers.map((l) => l.clear());
    aliens.map((a) => a.clear());
}

function mainLoop () {
    clearGame();
    updateGame();
    drawGame();
    animFrame( mainLoop );
}

function init() {
    "use strict";
    divArena = document.getElementById("arena");
    canArena = document.createElement("canvas");
    canArena.width = ArenaWidth;
    canArena.height= ArenaHeight;
    canArena.setAttribute("id", "canArena");
    conArena = canArena.getContext("2d");
    divArena.appendChild(canArena);

    ship = new Ship();

    alienFabric = new AlienFabric();
    alienFabric.onCreateAlien = function (alien) {
        aliens.push(alien);
    }

    ship.onShoot = function (laser) {
        lasers.push(laser);
    }

    animFrame( mainLoop );
}

window.addEventListener("load", init, false);

let ship;
let lasers = [];
let alienFabric;
let aliens = [];
