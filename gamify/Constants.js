//available options of movement/rotation
export const up=3;
export const down=1;
export const left=2;
export const right=0;

export const tileSize=32;
export const halfTileSize = 16;
export const velocity=1;
export const dim = 13;

export const difficulty=2;
export const enemyVelocity=1;
export const infinite=Math.pow(10, 1000);
export const MAXLIVES = 3;

export const frameRate = 60;
export const timeForFrame = 1/frameRate;
export const oneSec = 1000; //in msec
export const restartTime = 3;

export const WALL = 1;
export const ORB1 = 0;
export const powerdot = 2;
export const NOITEM = -1;

export const powerdotHigh = 2;
export const powerdotLow = 1;
export const powerdotNil = 0;
export const powerdotValidity = 8;
export const powerdotDangling = 4;

export const keycodes = {
    'a':65,
    'w':87,
    's':83,
    'd':68,
    'p':80
}

//speech commands mapped to keyboard button codes
export const cmds = {
    'up':keycodes.w,
    'bottom':keycodes.s,
    'left':keycodes.a,
    'right':keycodes.d,
    'play':keycodes.p
};

export const youLoose="GameOver.Refresh Page!";
export const youWin="You Win!Refresh Page!";
