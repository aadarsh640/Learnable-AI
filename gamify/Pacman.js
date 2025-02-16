import { tileSize,up,down,left,right,keycodes,velocity, WALL, oneSec,halfTileSize, NOITEM, ORB1, powerdot, powerdotNil, powerdotHigh, powerdotLow, powerdotDangling, powerdotValidity, MAXLIVES} from "./Constants.js";

export default class Pacman{
    //x,y - world pos
    //i,j - (row#,col#) - grid indices
    constructor(ctx,i,j,tileMap,uictx,uiSurf,inptCmds){
        //start speech recognition engine
        this.inputCommands = inptCmds;

        //world pos
        this.i = i;
        this.j = j;
        this.#initPos();
        
        //for drawing purpose
        //console.log("Pacman ctx " + ctx);
        this.ctx = ctx;
        this.uiSurf = uiSurf;
        this.uictx = uictx;
        //height of surface to hold hearts
        this.uiSurf.height = tileSize*2;
        this.tileMap = tileMap;

        //for animation purpose
        this.currAnimState = 0;
        this.states = this.#loadImages();

        //for movement
        this.currMovDir = null;
        this.chkNxtMovDir = null;
        //register any keyboard down movement to move player
        document.addEventListener("keydown",this.#handleKeyDown);

        //timer to change pacman animation image every 10s once
        setInterval(() => {
            this.currAnimState = (this.currAnimState+1)%3;
        }, oneSec/5);

        //score counter
        this.score = 0;
        this.scoreTag = document.getElementById("score");

        //audio files
        this.munch = new Audio("../assets/munch.wav");
        this.powerup = new Audio("../assets/powerdot.wav");

        //when pacman has eaten power dot,it scares the enemies
        this.powerdotState = powerdotNil;

        //lives avaiable
        this.lives = 3;
        this.isFirstTime = true;
        //to redraw uictx
        this.whiteHeart = new Image();
        this.whiteHeart.src = "../assets/whiteheart.png";
        //width of surface to hold 3 hearts
        this.uiSurf.width = this.lives*tileSize*2;
        this.heart = new Image();
        this.heart.src = "../assets/heart.png";
        this.isGameOver = false;
        //hurt sound
        this.hurt = new Audio("../assets/hurt.wav") ; 
    }


    //upon colliding with Enemy
    handleDamage(){
        //no hurt when power dot is active
        if(this.powerdotState !== powerdotHigh && this.powerdotState !== powerdotLow){
            //logical decrement of life
            this.lives--;
            //hurt sound
            this.hurt.play();

            //draw all the hearts
            for(let i = 0;i<MAXLIVES;i++){
                this.uictx.drawImage(this.heart,i*tileSize*2,0);
            }

            //draw the crossing of heart when life lost
            let remainingLife = MAXLIVES-this.lives;
            let drawLoc = 0;
            while(remainingLife>0){
                this.uictx.drawImage(this.whiteHeart,drawLoc*tileSize*2,0);
                remainingLife--;
                drawLoc++;
            }
            if(this.lives === 0){
                this.isGameOver = true;
            }
        }
    }

     //moving to a new dir is allowed only if pacman is not colliding.
     #move(){
         // collission condition
        let canMove = !this.tileMap.willCollideWith(WALL,this.j,this.i,this.chkNxtMovDir)

        //check if pacman wants to move in a new dir
        if(this.currMovDir !== this.chkNxtMovDir){
            //alert("wants to move...");
            //if yes,check for collission and change dir
            if(canMove){
                //alert("No collission..");
                //if no collission,then change currdir to new dir
                this.currMovDir = this.chkNxtMovDir;
            }// else alert("Collision..."); 
        } 

        //move if no collission:- doesnt matter if its new dir or old dir the movement is in
        if(canMove){
            //move the pacman in the currDir
            //alert("Curr mov dir " + this.currMovDir)
            switch(this.currMovDir){
                case up:
                    this.i -= velocity;
                    break;
                case down:
                    this.i += velocity;
                    break;
                case left:
                    //console.log("Moving left...");
                    this.j -= velocity;
                    break;
                case right:
                    //alert("Moving right...");
                    this.j += velocity;
                    break;
                default:
                   // console.log("No way this is possible...");
                    break;
            }
        }
    }

    //private methods
    #leftMov(){
        //if we are moving in the right dir currenlty,only then definetly(100%) we can move to thr right since we cam from the left
        if(this.currMovDir === right)
            this.currMovDir = left;
        //Else we need to check for collisions in the req dir
        this.chkNxtMovDir = left;
        this.#move();
    }

    #rightMov(){
        //alert("right move...");
        //if moving to left currenlty,only then we can definetly move to the right.
        if(this.currMovDir == left)
            this.currMovDir = right;
        //else check for collision
        this.chkNxtMovDir = right;
       // alert("Check next move dir " + this.chkNxtMovDir);
        this.#move();
    }

    #downMov(){
        if(this.currMovDir == up)
           this.currMovDir = down;
        this.chkNxtMovDir = down;
        this.#move();
    }

    #upMov(){
        if(this.currMovDir == down)
           this.currMovDir = up;
        this.chkNxtMovDir = up;
        this.#move();
    }

    //function with switch method to map the voice command to specific keyboard press
    #movementSwitch(Ikeycode){
        switch(Ikeycode){
            case keycodes.w:
                this.#upMov();
                break;
            case keycodes.a:
                this.#leftMov();
                break;
            case keycodes.s:
                this.#downMov();
                break;
            case keycodes.d:
                //alert("Pressed d....")
                this.#rightMov();
                break;
            default:
                //continue currState itself
                this.chkNxtMovDir = this.currMovDir;
                break;
        }
    }
    //using arrow function since we want "this" to be the pacman obj and not the dom
    #handleKeyDown = (event)=> {
        //alert(event.keyCode);
        this.#movementSwitch(event.keyCode);
    }

    //load all the required frames of animation
    #loadImages(){
        const state0 = new Image();
        state0.src = "../assets/pacman-1.png";

        const state1 = new Image();
        state1.src = "../assets/pacman-2.png";

        const state2 = new Image();
        state2.src = "../assets/pacman-3.png";

        //for animation purpose
        return [state0,state1,state2];
    }

    //returns the animation frame 
    #animationFrame(){
        return this.states[this.currAnimState];
    }

    //world pos
    #initPos(){
        if(this.i == null || this.j == null){
            //todo:assign random position
            this.i = 2;
            this.j = 2;
        }
    }

    #draw(){
        //to rotate,we must:
        //save current context
        this.ctx.save();
        //translate origin of rotation to pacman's center
        let x = this.j*tileSize;
        let y = this.i*tileSize;
        this.ctx.translate(x+halfTileSize,y+halfTileSize);
        this.ctx.rotate((Math.PI*this.currMovDir*90)/180);
        this.ctx.drawImage(
            this.#animationFrame(),
            -halfTileSize,
            -halfTileSize,
            tileSize,tileSize);
        this.ctx.restore();
    }

    //main worker function for the PACMAN character
    work(){
        if(this.isFirstTime){
            //draw all hearts
            for(let i = 0;i<MAXLIVES;i++){
                this.uictx.drawImage(this.heart,i*tileSize*2,0);
            }
            this.isFirstTime = false;
        }
        //speech command processing for pacman
        //console.log("Input speech commands " + JSON.stringify(this.inputCommands));
        //input commands given by voice
        if(this.inputCommands.length !== 0){
            //process inpt cmd,disable mike 
            document.getElementById("mike").src = "../assets/transparent.png";
            //console.log("Mike Disabled to " + document.getElementById("mike").src);
            //alert(document.getElementById("mike").src);
            //after moving,listen for next input cmd,enable mike
            setTimeout(() => {
                document.getElementById("mike").src = "../assets/mike.png";
            }, oneSec/2);

            let toProcessCmd = this.inputCommands.shift();
            this.#movementSwitch(toProcessCmd);
        }

        //check if orb is present to be eaten
        let theTile = this.tileMap.edibleAt(this.i,this.j);
        if(theTile!=null){
            //make the edible blank
            this.tileMap.visualGrid[this.i][this.j] = NOITEM;
            //increment the score
            switch(theTile){
                case ORB1:
                    this.munch.play();
                    this.score++;
                    break;
                case powerdot:
                    this.powerup.play();
                    this.powerdotState = powerdotHigh;
                    //after 3 seconds,powerdot starts to become low effect
                    setTimeout(() => {
                        this.powerdotState = powerdotLow;
                    }, oneSec*powerdotDangling);
                    //after 5 seconds powerdot expires
                    setTimeout(() => {
                        this.powerdotState = powerdotNil;
                    }, oneSec*powerdotValidity);
                    this.score+=5;
                    break;
            }
            //alert("Score is " + this.score);
        }
        //draw the pacman
        this.#draw();  
        this.scoreTag.innerHTML = `Score:${this.score}`;
    }
}