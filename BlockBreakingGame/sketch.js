//import {ball} from "./BlockBreakingGame.js";

let WIDTH = 800
let HEIGHT = 400

function setup() {
    createCanvas(WIDTH, HEIGHT);
    board.newBoard();
}
  
  function draw() {
    background(220);
    game.update();
    game.draw();
    
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        game.started = true;
    } 
}
