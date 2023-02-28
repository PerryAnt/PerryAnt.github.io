// [0, 0, 0, 0,
//     0, 0, 0, 0,
//     0, 0, 0, 0,
//     0, 0, 0, 0],



let pieces = [
            [0, 0, 0, 1,
             0, 0, 0, 1,
             0, 0, 0, 1,
             0, 0, 0, 1]
]

let player = {
    x_pos: 0,
    y_pos: 0,
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

    newPiece: function(){
        let index = Math.floor(Math.random() * pieces.length)
        this.piece = [...pieces[index]];
    }
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
    x_dim: 10,
    y_dim: 20,
    block_width: 20,
    block_height: 20,

    setup: function(){
        this.blocks = new Array(this.x_dim * this.y_dim);
        this.newBoard();
    },

    draw: function(){
        for(let i = 0; i < this.x_dim; i++){
            for(let j = 0; j < this.y_dim; j++){
                if(this.blocks[this.x_dim * j + i] ){
                    fill(255);
                    stroke(0);
                    rect(i * this.block_width, j * this.block_height, this.block_width, this.block_height);
                }
            }
        }


        
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
        for(let i = 0; i < this.x_dim; i++){
            for(let j = 0; j < this.y_dim; j++){
                this.blocks[this.x_dim * j + i] = 0;
            }
        }
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
        text(this.text, WIDTH/2, HEIGHT/4);
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
