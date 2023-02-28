let player = {
    x_pos: 30,
    y_pos: HEIGHT - 50,
    x_vel: 0,
    width: 60,
    height: 10,

    setup: function(){
        return;
    },

    draw: function() {
    },

    update: function() {

        
    },

    onStateChange: function(){
        switch(game.state){
                
            case "started":
                break;

            case "lost":
                break;
        }
    },
}

class Block {
    constructor(x_pos, y_pos, width, height, color) {
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(){
        fill(this.color);
        stroke(0);
        rect(this.x_pos, this.y_pos, this.width, this.height);
    }

    update(){
        return;
    }
}

let board = {
    blocks: [],

    setup: function(){

    },

    draw: function(){

    },

    update: function(){

    },

    onStateChange: function(){
        switch(game.state){
            case "started":
                break;

            case "lost":
                break;
        }
    },

    newBoard(){

    },
}

let gameText = {
    text: "",
    width: 0,

    setup: function(){
        this.onStateChange();
    },

    draw: function(){
        fill(0);
        text(this.text, WIDTH/2, 3/4*HEIGHT);
    },

    update: function(){
        return;
    },

    onStateChange: function(){
        switch(game.state){
            case "started":
                this.text = "";
                break;

            case "lost":
                this.text = "You lose\n Press space to start again"
                break;
        }
    },
}


let game = {
    state: "started", // "started" "lost" 
    objects: [player, board, gameText],

    setup: function(){
        for(x of this.objects){
            x.setup();
        }
    },
    
    startNewGame: function(){

    },

    draw: function(){
        for(x of this.objects){
            x.draw();
        }
    },

    update: function(){
        if(this.state == "lost")
        {
            return;
        }

        for(x of this.objects){
            x.update();
        }

    },

    onStateChange: function(){
        for(x of this.objects){
            x.onStateChange();
        }
    },

    keyPressed: function(){
        if (keyCode === LEFT_ARROW) {
            return;
        } 

        if (keyCode === RIGHT_ARROW) {
            return;
        } 
    },

    keyReleased: function(){
        return;
    }
}
