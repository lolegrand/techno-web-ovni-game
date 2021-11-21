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

//Button and text
let buttonRestart;
let numberOfKillsField;
let gameStatusField;

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

function hitBoxManagement() {
    let laserFilter = lasers.filter((l) => {
        for (const a of aliens) {
            if (manageHitBetweenObject(l.hitBox, a.hitBox))   {
                if (a.status !== "Destroying")
                    return false;
            }
        }
        return true;
    });
    aliens.map((a) => {
        for (const l of lasers) {
            if (manageHitBetweenObject(a.hitBox, l.hitBox)) {
                if (a.status !== "Destroying")
                    a.destroy();
            }
        }
    });

    lasers = laserFilter;

    aliens.forEach((a) => {
        if (manageHitBetweenObject(a.hitBox, ship.hitBox) && a.status === "Alive") {
            gameStatusField.innerHTML = gameStatus = "You loose";
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
    hitBoxManagement();
    alienFabric.update();
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

    if (gameStatus === "") {
        animFrame( mainLoop );
    }
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

    gameStatusField = document.getElementById("gameStatus");
    numberOfKillsField = document.getElementById("killDisplay");

    ship = new Ship();

    alienFabric = new AlienFabric();
    alienFabric.onCreateAlien = function (alien) {
        aliens.push(alien);
        alien.onDestroyed = function () {
            killCount++;
            numberOfKillsField.innerHTML = "Number of kills : " + killCount + ", Goal : 25";
        }
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
let gameStatus = "";
let killCount = 0;
