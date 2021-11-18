import { Ship } from "./model/ship.js";
import { Alien, AlienFabric } from "./model/alien.js";

var animFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    null;

//Canvas
var divArena;
var canArena;
var conArena;
var ArenaWidth = 500;
var ArenaHeight = 300;

//Background
var imgBackground;
var xBackgroundOffset = 0;
var xBackgroundSpeed = 1;
var backgroundWidth = 1782;
var backgroundHeight = 600;

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
    hitBoxManagement();
}

function hitBoxManagement() {
    let laserFilter = lasers.filter((l) => {
        for (const a of aliens) {
            if (isHit(l.hitBox, a.hitBox))   {
                if (a.status !== "Destroying")
                    return false;
            }
        }
        return true;
    });

    aliens.map((a) => {
        for (const l of lasers) {
            if (isHit(a.hitBox, l.hitBox)) {
                if (a.status !== "Destroying")
                    a.destroy();
            }
        }
    });

    lasers = laserFilter;
}

function isHit(hitBoxOne, hitBoxTwo) {
    let [x1,y1,w1,h1] = hitBoxOne;
    let [x2,y2,w2,h2] = hitBoxTwo;
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
}

function recursiveAnim () {
    "use strict";
    mainLoop();
    animFrame( recursiveAnim );
}

function init() {
    "use strict";
    divArena = document.getElementById("arena");
    canArena = document.createElement("canvas");
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

    animFrame( recursiveAnim );
}

window.addEventListener("load", init, false);

let ship;
let lasers = [];
let alienFabric;
let aliens = [];
