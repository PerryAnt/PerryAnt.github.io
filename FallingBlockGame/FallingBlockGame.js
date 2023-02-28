// [0, 0, 0, 0,
//     0, 0, 0, 0,
//     0, 0, 0, 0,
//     0, 0, 0, 0],
let block_width =  20;
let block_height = 20;

let pieces = [
                [0, 0, 0, 1,
                 0, 0, 0, 1,
                 0, 0, 0, 1,
                 0, 0, 0, 1]
    ]

let player = {
    x_pos: 0,
    y_pos: 0,
    x_dim: 4,
    y_dim: 4,
    piece: [],
    timeSinceLastDownMove: 0,

    setup: function(){
        this.newPiece();
        return;
    },

    draw: function() {
            for(let i = 0; i < this.x_dim; i++){
                for(let j = 0; j < this.y_dim; j++){
                    if(this.piece[i + j * this.x_dim]){
                        fill(255);
                        stroke(0);
                        rect( (this.x_pos + i) * block_width, (this.y_pos + j) * block_height, block_width, block_height);
                    }
                }
            }
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

    move: function(x_move, y_move){
        this.x_pos += x_move;
        this.y_pos += y_move;
    },

    newPiece: function(){
        let index = Math.floor(Math.random() * pieces.length)
        this.piece = [...pieces[index]];
        this.x_pos = 0;
        this.y_pos = 0;
    },

    getRotatedPieceClockwise: function(){
        newPiece = new Array(this.x_dim * this.y_dim);
    
        for(let i = 0; i < this.x_dim; i++){
            for(let j = 0; j < this.y_dim; j++){
                newPiece[i + j * this.x_dim] = this.piece[12 + j - 4 * i]
            }
        }
        return newPiece;
    },

    getRotatedPieceCounterClockwise: function(){
        newPiece = new Array(this.x_dim * this.y_dim);
    
        for(let i = 0; i < this.x_dim; i++){
            for(let j = 0; j < this.y_dim; j++){
                newPiece[i + j * this.x_dim] = this.piece[3 - j + 4 * i]
            }
        }
        return newPiece;
    },
}

let board = {
    blocks: [],
    x_dim: 10,
    y_dim: 20,

    setup: function(){
        this.blocks = new Array(this.x_dim * this.y_dim);
        this.newBoard();
    },

    draw: function(){
        for(let i = 0; i < this.x_dim; i++){
            for(let j = 0; j < this.y_dim; j++){
                if(this.blocks[i + j * this.x_dim] ){
                    fill(255);
                    stroke(0);
                    rect(i * block_width, j * block_height, block_width, block_height);
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
                this.blocks[i + j * this.x_dim] = 0;
            }
        }
    },

    checkForCollsionWithPlayer(x_pos, y_pos, piece)
    {
         //check for collisions
         for(let i = 0; i < player.x_dim; i++){
            for(let j = 0; j < player.y_dim; j++){
                if(piece[i + j * player.x_dim] ){
                    true_x_pos = x_pos + i;
                    true_y_pos = y_pos + j;

                    //pieces hits sides
                    if(true_x_pos < 0
                        || true_x_pos >= board.x_dim){
                        return 2;
                    }

                    //player piece hits blocks already on board or bottom
                    if(board.blocks[true_x_pos + true_y_pos * board.x_dim]
                        || true_y_pos >= board.y_dim){
                        return 1;
                    }
                }
            }
        }

        return 0;
    },

    setPiece: function(x_pos, y_pos, piece){
        for(let i = 0; i < player.x_dim; i++){
            for(let j = 0; j < player.y_dim; j++){
                true_x_pos = x_pos + i;
                true_y_pos = y_pos + j;

                if(piece[i + j * player.x_dim]){
                    this.blocks[true_x_pos + true_y_pos * this.x_dim] = 1;
                }
            }
        }
    }
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
    timeSinceLastDownMove: 0,

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

        this.timeSinceLastDownMove++

        if(this.timeSinceLastDownMove > 60){
            this.timeSinceLastDownMove = 0;
            this.movePlayer(0, 1);
        }

        for(x of this.objects){
            x.update();
        }

    },

    movePlayer: function(x_move, y_move){
        let x_pos = player.x_pos + x_move;
        let y_pos = player.y_pos + y_move;

        //check for collisions
        let collision = board.checkForCollsionWithPlayer(x_pos, y_pos, player.piece)

        if(collision == 1)
        {
            board.setPiece(player.x_pos, player.y_pos, player.piece);
            player.newPiece();
            return;
        }

        if(collision == 0)
        {
            player.move(x_move, y_move);
        }

        // for(let i = 0; i < player.x_dim; i++){
        //     for(let j = 0; j < player.y_dim; j++){
        //         if(player.piece[i + j * player.x_dim] ){
        //             true_x_pos = player.x_pos + i + x_move;
        //             true_y_pos = player.y_pos + j + y_move;

        //             //pieces hits sides
        //             if(true_x_pos < 0
        //                 || true_x_pos >= board.x_dim){
        //                 return;
        //             }

        //             //player piece hits blocks already on board or bottom
        //             if(board.blocks[true_x_pos + true_y_pos * board.x_dim]
        //                 || true_y_pos >= board.y_dim){
                        
        //                 return;
        //             }
        //         }
        //     }
        // }

    },

    rotatePlayer: function(direction){
        let newPiece ={};

        if(direction){
            newPiece = player.getRotatedPieceClockwise();
        } 
        else{
            newPiece = player.getRotatedPieceCounterClockwise();
        }

        let true_x_pos = 0;
        let true_y_pos = 0;

        //check for collisions
        for(let i = 0; i < player.x_dim; i++){
            for(let j = 0; j < player.y_dim; j++){
                if(newPiece[i + j * player.x_dim] ){
                    true_x_pos = player.x_pos + i;
                    true_y_pos = player.y_pos + j;

                    //pieces hits sides
                    if(true_x_pos < 0
                        || true_x_pos >= board.x_dim){
                        return;
                    }

                    //player piece hits blocks already on board or bottom
                    if(board.blocks[true_x_pos + true_y_pos * board.x_dim]
                        || true_y_pos >= board.y_dim){
                        return;
                    }
                }
            }
        }

        player.piece = newPiece; 
    },   

    onStateChange: function(){
        for(x of this.objects){
            x.onStateChange();
        }
    },

    keyPressed: function(){
        if (keyCode === LEFT_ARROW) {
            this.movePlayer(-1, 0);
            return;
        } 

        if (keyCode === RIGHT_ARROW) {
            this.movePlayer( 1, 0);
            return;
        } 

        if (keyCode === UP_ARROW) {
            this.rotatePlayer(1)
            return;
        }

        if (keyCode === DOWN_ARROW) {
            this.rotatePlayer(0)
            return;
        } 
    },

    keyReleased: function(){
        return;
    }
}
