/* Global variable: data definition
A const object that contains a collection of objects which stand for the elements in the game */

const BALLSPEED = 10;
const ORIGINAL_BALL_X_PLAYER1 = 250;
const ORIGINAL_BALL_Y_PLAYER1 = 100;
const ORIGINAL_BALL_X_PLAYER2 = 150;
const ORIGINAL_BALL_Y_PLAYER2 = 100;
const PADDLE_A_X = 100;
const PADDLE_A_Y = 100;
const PADDLE_B_X = 660;
const PADDLE_B_Y = 100;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 80;
const TOTAL_BALLS = 9;
const IA_SPEED = 3.7;

const tableFootballData = {
    paddleA: {
        x: PADDLE_A_X,
        y: PADDLE_A_Y,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT
    },
    paddleB: {
        x: PADDLE_B_X,
        y: PADDLE_B_Y,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT
    },
    playground: {
        offsetTop: document.getElementById("playground").getBoundingClientRect().top,
        height: parseInt(document.getElementById("playground").clientHeight),
        width: parseInt(document.getElementById("playground").clientWidth)
    },
    ball: {
        speed: BALLSPEED,
        x: ORIGINAL_BALL_X_PLAYER2,
        y: ORIGINAL_BALL_Y_PLAYER2,
        height: parseInt(document.getElementById("ball").clientHeight),
        directionX: 1,
        directionY: 1
    },
    scoreA: 0, // score for player A
    scoreB: 0 // score for player B
};

let pGround;

// Entry point
window.onload = init;

function init() {
    // set interval to call gameloop logic in 30 FPS
    tableFootballData.timer = setInterval(gameloop, 1000 / 30);

    // view rendering
    tableFootballData.request = window.requestAnimationFrame(render);
    tableFootballData.isRendering = true;
    tableFootballData.isPaused = false;

    let counter = document.getElementById("counter");

    for (let i = 0; i < TOTAL_BALLS; i++) {
        let element = document.createElement("div");
        let att = document.createAttribute("class");
        att.value = "ballRemaining";
        element.setAttributeNode(att);
        counter.appendChild(element);
    }
    // inputs
    handleMouseInputs();
}

function changeName(){
    let playerName = document.getElementById("playerName");
    let scoreB = document.getElementById("score-b");
    let name = window.prompt();
    playerName.innerHTML = name + " : <span id='score-b'>0</span>";
}

function gameloop() {
    if (tableFootballData.isPaused) {
        if (tableFootballData.isRendering)
            window.cancelAnimationFrame(tableFootballData.request);
        tableFootballData.isRendering = false;
        return;
    } else if (!tableFootballData.isRendering) {
        tableFootballData.request = window.requestAnimationFrame(render);
        tableFootballData.isRendering = true;

    }
    moveBall();
    autoMovePaddleA();
}

function render() {
    renderBall();
    renderPaddles();
    tableFootballData.request = window.requestAnimationFrame(render);
    tableFootballData.isRendering = true;
}

// To handle mouse's enter, move, and leave events
function handleMouseInputs() {
    // get the playground element
    pGround = document.querySelector("#playground");

    // run the game when mouse moves in the playground.
    pGround.addEventListener("mouseover", function (event) {
        tableFootballData.isPaused = false;
    });

    // pause the game when mouse moves out the playground.
    pGround.addEventListener("mouseout", function (event) {
        tableFootballData.isPaused = true;
    });

    // calculate the paddle position by using the mouse position.
    pGround.addEventListener("mousemove", function (event) {
        tableFootballData.paddleB.y = event.pageY - tableFootballData.playground.offsetTop;
    });
}

function moveBall() {
    let ball = tableFootballData.ball;

    // check playground top/bottom boundary
    if (ballHitsTopBottom()) {
        // reverse direction
        ball.directionY *= -1;
    }
    // check right
    if (ballHitsRightWall()) {
        playerAWin();
        counter.removeChild(counter.lastChild);
    }
    // check left
    if (ballHitsLeftWall()) {
        playerBWin();
        counter.removeChild(counter.lastChild);
    }

    // Variables for checking paddles
    let ballX = ball.x + ball.speed * ball.directionX;
    let ballY = ball.y + ball.speed * ball.directionY;
    // check moving paddle here, later check right paddle
    if (ballX >= tableFootballData.paddleA.x && ballX < tableFootballData.paddleA.x +
        tableFootballData.paddleA.width) {
        if (ballY <= tableFootballData.paddleA.y + tableFootballData.paddleA.height &&
            ballY >= tableFootballData.paddleA.y) {
            ball.directionX = 1;
        }
    }

    // check right paddle
    if (ballX >= tableFootballData.paddleB.x && ballX < tableFootballData.paddleB.x +
        tableFootballData.paddleB.width) {
        if (ballY <= tableFootballData.paddleB.y + tableFootballData.paddleB.height &&
            ballY >= tableFootballData.paddleB.y) {
            ball.directionX = -1;
        }
    }

    // update the ball position data
    ball.x += ball.speed * ball.directionX;
    ball.y += ball.speed * ball.directionY;

    //Game over if necessary

    if(tableFootballData.scoreA + tableFootballData.scoreB >= 9){

        let actualGameScreen = document.getElementById("playground");
        actualGameScreen.style.display = "none";

        let endGameScreen = document.getElementById("endgame");
        endGameScreen.style.display = "block";
    }
}

function autoMovePaddleA() {
    let speed = IA_SPEED;
    let direction = 1;
    let paddleY = tableFootballData.paddleA.y + tableFootballData.paddleA.height / 2;
    if (paddleY > tableFootballData.ball.y) {
        direction = -1;
    }

    tableFootballData.paddleA.y += speed * direction;
}

function renderBall() {
    let ball = tableFootballData.ball;
    let drawnBall = document.querySelector("#ball");

    // Change properties...
    drawnBall.style.left = (ball.x + ball.speed * ball.directionX) + "px";
    drawnBall.style.top = (ball.y + ball.speed * ball.directionY) + "px";
}

// view rendering
function renderPaddles() {
    let drawnPaddleA = document.querySelector("#paddleA");
    let drawnPaddleB = document.querySelector("#paddleB");

    // Change properties...
    drawnPaddleB.style.top = tableFootballData.paddleB.y + "px";
    drawnPaddleA.style.top = tableFootballData.paddleA.y + "px";
}

function ballHitsTopBottom() {
    let y = tableFootballData.ball.y + tableFootballData.ball.speed *
        tableFootballData.ball.directionY;
    return y < 0 || y + tableFootballData.ball.height > tableFootballData.playground.height;
}

function ballHitsRightWall() {
    return tableFootballData.ball.x + tableFootballData.ball.speed *
        tableFootballData.ball.directionX > tableFootballData.playground.width;
}

function ballHitsLeftWall() {
    return tableFootballData.ball.x + tableFootballData.ball.speed *
        tableFootballData.ball.directionX < 0;
}

function playerAWin() {
    let scorePlayerA = document.getElementById("score-a");

    // player B lost.
    tableFootballData.scoreA += 1;
    scorePlayerA.innerHTML = tableFootballData.scoreA.toString();
    // reset the ball;
    tableFootballData.ball.x = ORIGINAL_BALL_X_PLAYER1;
    tableFootballData.ball.y = ORIGINAL_BALL_Y_PLAYER1;

    tableFootballData.ball.directionX = -1;
}

function playerBWin() {
    let scorePlayerB = document.getElementById("score-b");

    // player A lost.
    tableFootballData.scoreB += 1;
    scorePlayerB.innerHTML = tableFootballData.scoreB.toString();
    // reset the ball;
    tableFootballData.ball.x = ORIGINAL_BALL_X_PLAYER2;
    tableFootballData.ball.y = ORIGINAL_BALL_Y_PLAYER2;

    tableFootballData.ball.directionX = 1;
}