import { tileSize,oneSec, WALL,enemyVelocity,up,down,left,right, timeForFrame, powerdotHigh, powerdotLow,powerdotNil, dim } from "./Constants.js";


export default class Enemy {
    constructor(i,j,tileMap,ctx,pacman){
        //to convert row,col to worldPos,do x=j*32 and y = i*32
        this.i = i;
        this.j = j;
        this.tileMap = tileMap;
        this.ctx = ctx;
        this.skipCounter = 0;
        this.speedReducer = 20;

        //ref to the pacman player
        this.pacman = pacman;

        //behaviour state
        this.currBehState = 0;
        //starting direction of movement
        this.currMovDir = right;
        //change direction after random amount time
        this.dirTimer = this.#random(1,5);

        //animation state
        this.currAnimState = 0;
        this.states = this.#loadImages();
        let powerdotLowCounter = 0;
        setInterval(() => {
            //change color of enemy based on pacman's powerdot consumption state 
            switch(pacman.powerdotState){
                case powerdotNil:
                    this.currAnimState = (this.currAnimState+1)%4;
                    break;
                case powerdotHigh:
                    this.currAnimState = 4;
                    break;
                case powerdotLow:
                    this.currAnimState  = (4 + powerdotLowCounter);
                    //console.log(this.currAnimState);
                    powerdotLowCounter = (powerdotLowCounter+1)%2;
                    break;
            }
        }, oneSec/5);
    }

    didCollideWithPacman(){
        return this.pacman.i === this.i && this.pacman.j == this.j;
    }

    //random value between min and max
    #random(min,max) {
        return min + Math.floor(Math.random(min,max)+1)
    }

    #loadImages(){
        let states = [];
        for(let i = 1;i<=6;i++){
            let state = new Image();
            state.src = `../assets/enemy-1-${i}.png`;
            states.push(state);
        }
        return states;
    }

    fetchAnimFrame(){
        return this.states[this.currAnimState];
    }

    work(){
        //move enemy based on the randomly changing direction
        //if movement in currDir doesnt make it collide
        if(this.skipCounter%this.speedReducer==0 && !this.tileMap.willCollideWith(WALL,this.j,this.i,this.currMovDir)){
            let I = this.i;
            let J = this.j;
            //alert(`row:${I},col:${J}`)

            //alert("Curr move dir " + this.currMovDir)
            switch(this.currMovDir){
                case up:
                    I -= enemyVelocity;
                    break;
                case down:
                    I += enemyVelocity;
                    break;
                case left:
                    //console.log("Moving left...");
                    J -= enemyVelocity;
                    break;
                case right:
                    //alert("Moving right...");
                    J += enemyVelocity;
                    break;
                default:
                    //console.log("No way this is possible...");
                    break;
            }

            if( this.tileMap.visualGrid[I][J] !== WALL){
                this.i = I;
                this.j = J;
            }
            
        }
        //move once in 20 frames
        this.skipCounter = (this.skipCounter+1)%this.speedReducer;

        //manual timer to change dir
        this.dirTimer -= timeForFrame;
       // console.log(this.dirTimer);
        //reset timer if it becomes zero
        if(this.dirTimer < 0) this.dirTimer = 0;
        if(this.dirTimer == 0){
            //check right box
            if(this.j+1<dim&&this.j+1>=0&&this.j+1==this.pacman.j&&this.i==this.pacman.i){
                this.currMovDir = right;
            }
            else if(this.j-1<dim&&this.j-1>=0&&this.j-1==this.pacman.j&&this.i==this.pacman.i){ //left
                this.currMovDir = left;
            }
            else if(this.i-1<dim&&this.i-1>=0&&this.j==this.pacman.j&&this.i-1==this.pacman.i){ //up
                this.currMovDir = up;
            }
            else if(this.i+1<dim&&this.i+1>=0&&this.j==this.pacman.j&&this.i+1==this.pacman.i){ //down
                this.currMovDir = down;
            }
            else{ //if not nearby
                this.currMovDir = Math.floor(Math.random()*4);
            }
            this.dirTimer = this.#random(1,5);
            //alert(this.dirTimer);
        };

        //drawing
        this.ctx.drawImage(this.fetchAnimFrame(),this.j*tileSize,this.i*tileSize);
    }
}