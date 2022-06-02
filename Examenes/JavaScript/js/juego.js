const DEFAULT_COLOR_SHIP = "#c62946"; //ALGUN CAMBIO HABRÁ EN ESTAS CONSTANTES
const DEFAULT_COLOR_UFOS = "#3f3f3f";
const SHIP_WIDTH = 63;
const SHIP_HEIGHT = 30;
const UFO_WIDTH = 39;
const UFO_HEIGHT = 24;
const SHIP_SPEED_X = 5;
const SHIP_SPEED_Y = 5;
const FPS = 30;
const CHRONO_MSG = "Time elapsed:";
const RIGHTARROW_KEYCODE = 39;
const LEFTARROW_KEYCODE = 37;
const UPARROW_KEYCODE = 38;
const DOWNARROW_KEYCODE = 40;
const SECONDS_UFO1 = 2;
const PROBABILITY_UFO1 = 0.7;
const SECONDS_UFO2 = 3;
const PROBABILITY_UFO2 = 0.6;
const MIN_SPEED_X_UFO = 4;
const MAX_SPEED_X_UFO = 12;
const LIVES_BEGIN = 3;
const WIDTH_LIVE = 82;
const HEIGHT_LIVE = 49;

class Ship {
    constructor(x, y, width, height, color, img) { //CAMBIO
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speedX = 0;
        this.speedY = 0;
        this.img = img; //CAMBIO
    }

    setSpeedX(speedX) {
        this.speedX = speedX;
    }

    setSpeedY(speedY) {
        this.speedY = speedY;
    }

    render(ctx) { //CAMBIO
        if (this.img == null){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else{
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    move() { //CAMBIO
        this.x += this.speedX;
        this.y += this.speedY;
        if(this.y <=0){
            this.speedY = -this.speedY;
        }
        if(this.y >=canvas.height-this.height){
            this.speedY = -this.speedY;
        }
    }

    setIntoArea(endX, endY) {
        this.x = Math.min(Math.max(0, this.x), (endX - this.width));
        this.y = Math.min(Math.max(0, this.y), (endY - this.height));
    }

    crashWith(obj) {
        // detect collision with the bounding box algorithm
        let myleft = this.x;
        let myright = this.x + this.width;
        let mytop = this.y;
        let mybottom = this.y + this.height;
        let otherleft = obj.x;
        let otherright = obj.x + obj.width;
        let othertop = obj.y;
        let otherbottom = obj.y + obj.height;
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }

    setX(newX){ //CAMBIO
        this.x = newX;
    }

    setY(newY){ //CAMBIO
        this.y = newY;
    }
}

class GameCanvas {
    constructor(_canvas, _ship, _ufos, /*_livesleft*/) {
        this.canvas = _canvas;
        this.ship = _ship;
        this.ufos = _ufos;
        this.context = null;
        this.interval = null;
        //this.livesleft = _livesleft;
    }

    initialise(canvasWidth, canvasHeight) {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGame, 1000 / FPS);
    }

    render() {
        for (const ufo of this.ufos) {
            ufo.render(this.context);
        }
        this.ship.render(this.context);
    }

   /* renderLives(){//CAMBIO (ESTO NO SÉ CÓMO HACERLO Y PENSADO EMPEZANDO DE ESTA MANERA IDK)
        let imageLives = new Image();
        imageLives.src = 'imgs/spaceship.png';
        for(let i = 0; i < lives; i++){
            this.livesleft.drawImage(this.img, this.x, this.y, WIDTH_LIVE, HEIGHT_LIVE);
        }
    }*/

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addUfo(ufo) {
        this.ufos.push(ufo);
    }

    removeUfo(i) {
        this.ufos.splice(i, 1);
    }

    removeAllUfos() {
        for(let i = 0; i < this.ufos.length; i++){
            this.removeUfo(i);
        }
    }
}

let canvas = document.getElementById("canvasGame"); //CAMBIO
let canvasWidth = canvas.width; //CAMBIO
let canvasHeight = canvas.height; //CAMBIO
//let livesleft = document.getElementById("livesleft"); //CAMBIO

let image = new Image(); //CAMBIO
image.src = 'imgs/spaceship.png'; //CAMBIO

let theShip = new Ship(0, canvasHeight / 2, SHIP_WIDTH, SHIP_HEIGHT, DEFAULT_COLOR_SHIP, image); //CAMBIO
let rightArrowPressed = false,
    leftArrowPressed = false,
    upArrowPressed = false,
    downArrowPressed = false;
let seconds, timeout, theChrono;
let continueGame = true;
let gameArea = new GameCanvas(canvas, theShip, []/*, livesleft*/); //CAMBIO
let lives = LIVES_BEGIN; //CAMBIO

window.onload = startGame;

function handlerOne(event) {
    switch (event.keyCode) {
        case RIGHTARROW_KEYCODE:
            if (!rightArrowPressed) {
                rightArrowPressed = true;
                theShip.setSpeedX(SHIP_SPEED_X);
            }
            break;
        case LEFTARROW_KEYCODE:
            if (!leftArrowPressed) {
                leftArrowPressed = true;
                theShip.setSpeedX(-SHIP_SPEED_X);
            }
            break;
        case UPARROW_KEYCODE:
            if (!upArrowPressed) {
                upArrowPressed = true;
                theShip.setSpeedY(-SHIP_SPEED_Y);
            }
            break;
        case DOWNARROW_KEYCODE:
            if (!downArrowPressed) {
                downArrowPressed = true;
                theShip.setSpeedY(SHIP_SPEED_Y);
            }
            break;
        default:
            break;
    }
}

function handlerTwo(event) {
    switch (event.keyCode) {
        case RIGHTARROW_KEYCODE:
            rightArrowPressed = false;
            theShip.setSpeedX(0);
            break;
        case LEFTARROW_KEYCODE:
            leftArrowPressed = false;
            theShip.setSpeedX(0);
            break;
        case UPARROW_KEYCODE:
            upArrowPressed = false;
            theShip.setSpeedY(0);
            break;
        case DOWNARROW_KEYCODE:
            downArrowPressed = false;
            theShip.setSpeedY(0);
            break;
        default:
            break;
    }
}

function startGame() {
    gameArea.initialise(canvasWidth, canvasHeight);
    gameArea.render();
    lives = 3; //CAMBIO
    //gameArea.renderLives();

    window.document.addEventListener("keydown", handlerOne);
    window.document.addEventListener("keyup", handlerTwo);

    seconds = 0;
    timeout = window.setTimeout(updateChrono, 1000);
    theChrono = document.getElementById("chrono");
}

function updateGame() {
    // Check collision for ending game
    let collision = false;
    for (let i = 0; i < gameArea.ufos.length; i++) {
        if (theShip.crashWith(gameArea.ufos[i])) {
            lives -- //CAMBIO
            if(lives <= 0) collision = true; //CAMBIO
            break;
        }
    }
    if (collision) {
        endGame();
    } else {
        // Move ufos and delete the ones that goes outside the canvas
        for (let i = gameArea.ufos.length - 1; i >= 0; i--) {
            gameArea.ufos[i].move();
            if (gameArea.ufos[i].x + UFO_WIDTH <= 0) {
                gameArea.removeUfo(i);
            }
        }
        // Move our hero
        theShip.move();
        // Our hero can't go outside the canvas
        theShip.setIntoArea(gameArea.canvas.width, gameArea.canvas.height);
        gameArea.clear();
        gameArea.render();
    }
}

function updateChrono() {
    if (continueGame) {
        seconds++;
        // First: check if the given number of seconds to show an UFO has passed
        if (seconds % SECONDS_UFO1 === 0) {
            let chance = Math.random();
            // if an ufo has to be generated
            if (chance < PROBABILITY_UFO1) {
                // random position in Y axis
                let posY = Math.floor(Math.random() * (canvasHeight - UFO_HEIGHT));
                let ufo = new Ship(canvasWidth, posY, UFO_WIDTH, UFO_HEIGHT, DEFAULT_COLOR_UFOS);
                // random speed
                let speed = Math.floor(Math.random() * (MAX_SPEED_X_UFO - MIN_SPEED_X_UFO + 1) +
                    MIN_SPEED_X_UFO);
                ufo.setSpeedX(-speed);
                gameArea.addUfo(ufo);
            }
        }
        if (seconds % SECONDS_UFO2 === 0) { //CAMBIO
            let chance = Math.random();
            // if an ufo has to be generated
            if (chance < PROBABILITY_UFO2) {
                // random position in Y axis
                let posY = Math.floor(Math.random() * ((canvasHeight - UFO_HEIGHT)*4/5) + ((canvasHeight - UFO_HEIGHT)/5));
                let imageUfo = new Image();
                imageUfo.src = 'imgs/nave_alien.png';

                let ufo = new Ship(canvasWidth, posY, UFO_WIDTH, UFO_HEIGHT, DEFAULT_COLOR_UFOS, imageUfo);
                // random speed
                let vX = Math.random() *15 +6;
                let vY = Math.random() *15 +6;
                if(Math.random() <= 0.5) vY = -vY;
                ufo.setSpeedX(-vX);
                ufo.setSpeedY(vY);
                gameArea.addUfo(ufo);
            }
        }
        let minutes = Math.floor(seconds / 60);
        let secondsToShow = seconds % 60;
        theChrono.innerHTML = CHRONO_MSG + " " + String(minutes).padStart(2, "0") + ":" +
            String(secondsToShow).padStart(2, "0");
        timeout = window.setTimeout(updateChrono, 1000);
    }
}

function endGame() {
    continueGame = false;
    clearInterval(gameArea.interval);
    window.document.removeEventListener("keydown", handlerOne);
    window.document.removeEventListener("keyup", handlerTwo);
}