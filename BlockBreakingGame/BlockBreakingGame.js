function clamp(x, lower, upper){
    return Math.min(upper, Math.max(lower, x));
}

let ball = {
    x_pos: 30,
    y_pos: HEIGHT - 50,
    x_vel: 1,
    y_vel: 1,
    radius: 10,

    draw: function() {
        fill(0, 0, 255);
        stroke(0, 0, 255);
        circle(this.x_pos, this.y_pos, 2 * this.radius);
    },

    update: function() {
        //vertical wall collision
        if(this.x_pos - this.radius < 0 || this.x_pos + this.radius > WIDTH){
            this.x_vel *= -1;
        }

        //horizontal wall collision
        if(this.y_pos - this.radius < 0 || this.y_pos + this.radius > HEIGHT){
            this.y_vel *= -1;
        }

        //player collision
        if(this.y_pos + this.radius > player.y_pos && this.x_pos > player.x_pos && this.x_pos < player.x_pos + player.width){
            this.y_vel = -1;
        }

        this.x_pos += this.x_vel;
        this.y_pos += this.y_vel;
      }
}

let player = {
    x_pos: 30,
    y_pos: HEIGHT - 50,
    x_vel: 0,
    width: 60,
    height: 10,

    draw: function() {
        fill(255);
        stroke(0);
        rect(this.x_pos, this.y_pos, this.width, this.height);
    },

    update: function() {
        this.x_vel = 0;

        if(keyIsDown(LEFT_ARROW)){
            this.x_vel -= 2;
        }

        if(keyIsDown(RIGHT_ARROW)){
            this.x_vel += 2;
        }

        this.x_pos += this.x_vel;

        if(this.x_pos < 0){
            this.x_pos = 0;
        }

        if(this.x_pos + this.width > WIDTH){
            this.x_pos = WIDTH - this.width;
        }
        
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
    update(){return}
}

let board = {
    blocks: [],

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
                return;
            }  
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
    }
}

let game = {
    level: 1,

    objects: [ball, player, board],
    
    draw: function(){
        for(x of this.objects){
            x.draw();
        }
    },

    update: function(){
        for(x of this.objects){
            x.update();
        }
    },
}
