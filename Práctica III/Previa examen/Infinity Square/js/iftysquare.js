const GAME_AREA_WIDTH = 800;
const GAME_AREA_HEIGHT = 500;
const SQUARE_SIZE = 40;
const SQUARE_COLOR = "#cc0000";
const SQUARE_SPEED_X = 5;
const SQUARE_SPEED_Y = 5;
const NEWENEMIES_SPEED = [1,2,3,4,5];
const OBSTACLE_SPEED = 2;
const OBSTACLE_COLOR = "#187440";
const OBSTACLE_MIN_HEIGHT = 40;
const OBSTACLE_MAX_HEIGHT = GAME_AREA_HEIGHT - 100;
const OBSTACLE_WIDTH = 20;
const OBSTACLE_MIN_GAP = 55;
const OBSTACLE_MAX_GAP = GAME_AREA_HEIGHT - 100;
const PROBABILITY_OBSTACLE = 0.7;
const FRAME_OBSTACLE = 85;
const FPS = 30;
const CHRONO_MSG = "Time goes by...";
const RIGHTARROW_KEYCODE = 39;
const LEFTARROW_KEYCODE = 37;
const UPARROW_KEYCODE = 38;
const DOWNARROW_KEYCODE = 40;

class SquaredForm {
    constructor(x, y, width, height, color, picture = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speedX = 0;
        this.speedY = 0;
        this.picture = picture;
    }

    setSpeedX(speedX) {
        this.speedX = speedX;
    }

    setSpeedY(speedY) {
        this.speedY = speedY;
    }

    render(ctx) {
        if (this.picture == null){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else ctx.drawImage(this.picture, this.x, this.y)

    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
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
}

class GameArea {
    constructor(canvas, hero, obstacles, newenemies) {
        this.canvas = canvas;
        this.hero = hero;
        this.obstacles = obstacles;
        this.newenemies = newenemies;
        this.context = null;
        this.interval = null;
        this.frameNumber = undefined;
    }

    initialise() {
        this.canvas.width = GAME_AREA_WIDTH;
        this.canvas.height = GAME_AREA_HEIGHT;
        this.context = this.canvas.getContext("2d");
        let theDiv = document.getElementById("gameplay");
        theDiv.appendChild(this.canvas);
        this.interval = setInterval(updateGame, 1000 / FPS);
        this.frameNumber = 0;
    }

    render() {
        for (const obstacle of this.obstacles) {
            obstacle.render(this.context);
        }

        for (const newEnemy of this.newenemies) {
            newEnemy.render(this.context);
        }

        this.hero.render(this.context);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
    }

    addNewEnemies(newEnemy) {
        this.newenemies.push(newEnemy);
    }

    removeObstacle(i) {
        this.obstacles.splice(i, 1);
    }

    removeNewEnemy(i) {
        this.newenemies.splice(i, 1);
    }
}

let heroPic = document.createElement("img"); 
heroPic.src = "imgs/nave.png";

let theSquare = new SquaredForm(0, GAME_AREA_HEIGHT / 2, SQUARE_SIZE, SQUARE_SIZE, SQUARE_COLOR, heroPic);
let rightArrowPressed = false,
    leftArrowPressed = false,
    upArrowPressed = false,
    downArrowPressed = false;
let seconds, timeout, theChrono;
let continueGame = true;
let gameArea = new GameArea(document.createElement("canvas"), theSquare, [], []);

window.onload = startGame;

function handlerOne(event) {
    switch (event.keyCode) {
        case RIGHTARROW_KEYCODE:
            if (!rightArrowPressed) {
                rightArrowPressed = true;
                theSquare.setSpeedX(SQUARE_SPEED_X);
            }
            break;
        case LEFTARROW_KEYCODE:
            if (!leftArrowPressed) {
                leftArrowPressed = true;
                theSquare.setSpeedX(-SQUARE_SPEED_X);
            }
            break;
        case UPARROW_KEYCODE:
            if (!upArrowPressed) {
                upArrowPressed = true;
                theSquare.setSpeedY(-SQUARE_SPEED_Y);
            }
            break;
        case DOWNARROW_KEYCODE:
            if (!downArrowPressed) {
                downArrowPressed = true;
                theSquare.setSpeedY(SQUARE_SPEED_Y);
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
            theSquare.setSpeedX(0);
            break;
        case LEFTARROW_KEYCODE:
            leftArrowPressed = false;
            theSquare.setSpeedX(0);
            break;
        case UPARROW_KEYCODE:
            upArrowPressed = false;
            theSquare.setSpeedY(0);
            break;
        case DOWNARROW_KEYCODE:
            downArrowPressed = false;
            theSquare.setSpeedY(0);
            break;
        default:
            break;
    }
}

function startGame() {
    gameArea.initialise();
    gameArea.render();

    window.document.addEventListener("keydown", handlerOne);
    window.document.addEventListener("keyup", handlerTwo);

    seconds = 0;
    timeout = window.setTimeout(updateChrono, 1000);
    theChrono = document.getElementById("chrono");
}

function updateGame() {
    // Check collision for ending game
    let collision = false;
    for (let i = 0; i < gameArea.obstacles.length; i++) {
        if (theSquare.crashWith(gameArea.obstacles[i])) {
            collision = true;
            break;
        }
    }
    if (collision) {
        endGame();
    } else {
        // Increase count of frames
        gameArea.frameNumber += 1;
        // Let's see if new obstacles must be created
        if (gameArea.frameNumber >= FRAME_OBSTACLE)
            gameArea.frameNumber = 1;
        // First: check if the given number of frames has passed
        if (gameArea.frameNumber == 1) {
            let chance = Math.random();
            if (chance < PROBABILITY_OBSTACLE) {
                let height = Math.floor(Math.random() * (OBSTACLE_MAX_HEIGHT - OBSTACLE_MIN_HEIGHT +
                    1) + OBSTACLE_MIN_HEIGHT);
                let gap = Math.floor(Math.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP + 1) +
                    OBSTACLE_MIN_GAP);
                let form = new SquaredForm(gameArea.canvas.width, 0, OBSTACLE_WIDTH, height, OBSTACLE_COLOR);
                form.setSpeedX(-OBSTACLE_SPEED);
                gameArea.addObstacle(form);
                // The obstacle at the bottom only is created if there is enough room
                if ((height + gap + OBSTACLE_MIN_HEIGHT) <= gameArea.canvas.height) {
                    form = new SquaredForm(gameArea.canvas.width, height + gap, OBSTACLE_WIDTH,
                        gameArea.canvas.height - height - gap, OBSTACLE_COLOR);
                    form.setSpeedX(-OBSTACLE_SPEED);
                    gameArea.addObstacle(form);
                }
            }

            if (chance < PROBABILITY_OBSTACLE*3) {
                let newEnemy = new SquaredForm(GAME_AREA_WIDTH, Math.floor(Math.random() * GAME_AREA_HEIGHT), SQUARE_SIZE/2, SQUARE_SIZE/2, "#000000");
                
                if (Math.random() < 0.5) newEnemy.setSpeedX(-NEWENEMIES_SPEED[Math.floor(Math.random())*4]*10);
                else newEnemy.setSpeedX(NEWENEMIES_SPEED[Math.floor(Math.random())*4]*10);

                if (Math.random() < 0.5) newEnemy.setSpeedY(-NEWENEMIES_SPEED[Math.floor(Math.random())*4])*10;
                else newEnemy.setSpeedY(NEWENEMIES_SPEED[Math.floor(Math.random())*4])*10;
                
                gameArea.addNewEnemies(newEnemy);
            }
        }
        // Move obstacles and delete the ones that goes outside the canvas
        for (let i = gameArea.obstacles.length - 1; i >= 0; i--) {
            gameArea.obstacles[i].move();
            if (gameArea.obstacles[i].x + OBSTACLE_WIDTH <= 0) {
                gameArea.removeObstacle(i);
                console.log("se borro");

            }
            else if (gameArea.obstacles[i].y + gameArea.canvas.height <= 0) {
                console.log("hasta luego");
            }
        }

        for (let i = gameArea.newenemies.length - 1; i >= 0; i--) {
            gameArea.newenemies[i].move();
            if (gameArea.newenemies[i].x + OBSTACLE_WIDTH <= 0) {
                gameArea.removeNewEnemy(i);
            }
        }
        // Move our hero
        theSquare.move();
        // Our hero can't go outside the canvas
        theSquare.setIntoArea(gameArea.canvas.width, gameArea.canvas.height);
        gameArea.clear();
        gameArea.render();
    }
}

function updateChrono() {
    if (continueGame) {
        seconds++;
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