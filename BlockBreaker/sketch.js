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
    if (keyCode === LEFT_ARROW) {
        player.x_vel = -1;
    } else if (keyCode === RIGHT_ARROW) {
        player.x_vel = 1;
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW) {
        player.x_vel = 0;
    } else if (keyCode === RIGHT_ARROW) {
        player.x_vel = 0;
    }
}