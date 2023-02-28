//import {ball} from "./BlockBreakingGame.js";

let WIDTH = 800
let HEIGHT = 400

function setup() {
    createCanvas(WIDTH, HEIGHT);
    textAlign(CENTER);
    textSize(32);

    game.setup();
}
  
  function draw() {
    background(220);
    game.update();
    game.draw();
    
}

function keyPressed() {
    game.keyPressed(keyCode);
}

function keyReleased() {
    game.keyReleased(keyCode);
}
