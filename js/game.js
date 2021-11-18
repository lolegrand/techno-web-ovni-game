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
    }
    alienFabric.update();
}

function drawGame() {
    drawScene();
    ship.draw();
    lasers.map((l) => l.draw());
    aliens.map((a)=>a.draw())
}

function clearGame() {
    ship.clear();
    lasers.map((l) => l.clear());
    aliens.map((a)=>a.clear());
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
