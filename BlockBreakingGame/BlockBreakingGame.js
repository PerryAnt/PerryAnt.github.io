function clamp(x, lower, upper){
    return Math.min(upper, Math.max(lower, x));
}

let ball = {
    x_pos: 0,
    y_pos: 0,
    x_vel: 0,
    y_vel: 0,
    radius: 10,

    setup: function(){
        return;
    },

    draw: function() {
        fill(0, 0, 255);
        stroke(0, 0, 255);
        circle(this.x_pos, this.y_pos, 2 * this.radius);
    },

    update: function() {
        if(game.state == "starting"){
            this.x_pos = player.x_pos + player.width/2;
            this.y_pos = player.y_pos - 20;
            return;
        }

        //vertical wall collision
        if(this.x_pos - this.radius < 0 || this.x_pos + this.radius > WIDTH){
            this.x_vel *= -1;
        }

        //horizontal wall collision
        if(this.y_pos - this.radius < 0){
            this.y_vel *= -1;
        }

        if(this.y_pos + this.radius > HEIGHT){
            game.state = "lost";
            game.onStateChange();
            return;
        }

        //player collision
        if(this.y_pos + this.radius > player.y_pos && this.x_pos > player.x_pos && this.x_pos < player.x_pos + player.width){

            let d = this.x_pos - player.x_pos - player.width/2;
            //sends ball in direction based on how far from the center of the player rectangle it hits
            //9/10 factor prevents the y-velocity from being zero 
            this.x_vel = Math.sin(d / player.width * Math.PI * 9/10)
            this.y_vel = -Math.sqrt(1 - this.x_vel**2)

        }

        this.x_pos += this.x_vel;
        this.y_pos += this.y_vel;
      },

    onStateChange: function(){
        return;
    },
}

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
        fill(255);
        stroke(0);
        rect(this.x_pos, this.y_pos, this.width, this.height);
    },

    update: function() {

        this.x_pos += this.x_vel;
        this.x_pos = clamp(this.x_pos, 0, WIDTH - this.width)
        
    },

    onStateChange: function(){
        switch(game.state){
            case "starting":
                this.x_pos =  30;
                this.y_pos =  HEIGHT - 50;
                break;
                
            case "started":
                break;

            case "lost":
                break;

            case "won":
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
        board.newBoard();
    },

    draw: function(){
        for(b of this.blocks){
            b.draw();
        }
    },

    update: function(){
        let x = 0;
        let y = 0;
        let d = 0;
        let b = this.blocks[0];

        //check each block for collision with ball
        //uses algorithm from https://www.youtube.com/watch?v=D2a5fHX-Qrs
        for(let i = 0; i < this.blocks.length; i++){
            b = this.blocks[i]
            x = clamp(ball.x_pos, b.x_pos, b.x_pos + b.width) - ball.x_pos;
            y = clamp(ball.y_pos, b.y_pos, b.y_pos + b.height) - ball.y_pos;

            d = Math.sqrt(x ** 2 + y ** 2);
            if(d <= ball.radius){

                if(x){ball.x_vel *= -1}
                if(y){ball.y_vel *= -1}

                x /= d;
                y /= d;

                ball.x_pos += -x * (ball.radius - d)
                ball.y_pos += -y * (ball.radius - d)

                this.blocks.splice(i, 1);
                if(this.blocks.length == 0)
                {
                    game.state = "won"
                    game.onStateChange();
                }
                return;
            }  
        }
    },

    onStateChange: function(){
        switch(game.state){
            case "starting":
                this.newBoard();
                break;

            case "started":
                break;

            case "lost":
                break;

            case "won":
                break;
        }
    },

    newBoard(){
        this.blocks = [];
        let block;
        let width = WIDTH/10;
        let height = HEIGHT/10/2;

        for(let x = 0; x < 10; x++){
            for(let y = 0; y < 10; y++){
                block = new Block(width*x, height*y, width, height, 255);
                this.blocks.push(block);
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
        text(this.text, WIDTH/2, 3/4*HEIGHT);
    },

    update: function(){
        return;
    },

    onStateChange: function(){
        switch(game.state){
            case "starting":
                this.text = "Move with left and right arrows\n" 
                            + "press up to start game";
                break;
            case "started":
                this.text = "";
                break;

            case "lost":
                this.text = "You lose\n Press space to start again"
                break;

            case "won":
                this.text = "You won!\n Press space to start again"
                break;
        }
    },
}


let game = {
    state: "starting", //"starting" "started" "lost" "won"
    objects: [ball, player, board, gameText],

    setup: function(){
        for(x of this.objects){
            x.setup();
        }
    },
    
    startNewGame: function(){
        this.state = "started";
        ball.y_vel = -1;
        this.onStateChange();
    },

    draw: function(){
        for(x of this.objects){
            x.draw();
        }
    },

    update: function(){
        if(this.state == "stopped" || this.state == "lost")
        {
            return;
        }

        //update individual objects
        for(x of this.objects){
            x.update();
        }

    },

    onStateChange: function(){
        //update individual objects
        for(x of this.objects){
            x.onStateChange();
        }
    },

    keyPressed: function(){
        if (keyCode === LEFT_ARROW) {
            player.x_vel -= 2;
            return;
        } 

        if (keyCode === RIGHT_ARROW) {
            player.x_vel += 2;
            return;
        } 
    },

    keyReleased: function(){
        if (keyCode === UP_ARROW && this.state == "starting") {
            this.startNewGame();
            return;
        } 

        if (keyCode === LEFT_ARROW) {
            player.x_vel += 2;
            return;
        } 

        if (keyCode === RIGHT_ARROW) {
            player.x_vel -= 2;
            return;
        } 

        if(keyCode == 32 &&
            (this.state == "won" || this.state == "lost")){
                this.state = "starting"
                this.onStateChange();
                return;
        }

    }
}
