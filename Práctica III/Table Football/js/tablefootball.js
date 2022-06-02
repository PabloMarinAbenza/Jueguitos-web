const paddleWidth = 20;
const paddleHeight = 70;
const initialScore = 0;
const FPS = 30;
const initialBalls = 9;

/* Global variable: data definition
A const object that contains a collection of objects which stand for the elements in the game */
const tableFootballData = {
    paddleA: {
        x: 50,
        y: 100,
        width: paddleWidth,
        height: paddleHeight
    },
    paddleB: {
        x: 320,
        y: 100,
        width: paddleWidth,
        height: paddleHeight
    },
    playground: {
        offsetTop: document.getElementById("playground").getBoundingClientRect().top,
        height: parseInt(document.getElementById("playground").clientHeight),
        width: parseInt(document.getElementById("playground").clientWidth)
    },
    ball: {
        speed: 5,
        x: 150,
        y: 100,
        height: parseInt(document.getElementById("ball").clientHeight),
        directionX: 1,
        directionY: 1
    },
    scoreA: initialScore, // score for player A
    scoreB: initialScore // score for player B
};

let pGround;

// Entry point
window.onload = init;

function init() {
    // set interval to call gameloop logic in 30 FPS
    tableFootballData.timer = setInterval(gameloop, 1000 / FPS);

    // view rendering
    tableFootballData.request = window.requestAnimationFrame(render);
    tableFootballData.isRendering = true;
    tableFootballData.isPaused = false;

    // render balls remaining --- doesn't appear correctly, but does appear
    let ballsDiv = document.getElementById("ballsRemaining");

    for (let i = 0; i < initialBalls; i++) {
        let ballImage = document.createElement("div");
        let att = document.createAttribute("class");
        att.value = "ballAspect";
        ballImage.setAttributeNode(att);
        ballsDiv.appendChild(ballImage);
    }

    // inputs
    handleMouseInputs();
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

let currentBalls = initialBalls;

function moveBall() {
    let ball = tableFootballData.ball;
    let ballsDiv = document.getElementById("ballsRemaining");

    // check playground top/bottom boundary
    if (ballHitsTopBottom()) {
        // reverse direction
        ball.directionY *= -1;
    }
    // check right
    if (ballHitsRightWall()) {
        ballsDiv.removeChild(ballsDiv.lastChild);
        currentBalls--;
        playerAWin();
    }
    // check left
    if (ballHitsLeftWall()) {
        ballsDiv.removeChild(ballsDiv.lastChild);
        currentBalls--;
        playerBWin();
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
}

function autoMovePaddleA() {
    let speed = 3.7;
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

    if (currentBalls > 0){
        // player B lost.
        tableFootballData.scoreA += 1;
        scorePlayerA.innerHTML = tableFootballData.scoreA.toString();
        // reset the ball;
        tableFootballData.ball.x = 250;
        tableFootballData.ball.y = 100;

        tableFootballData.ball.directionX = -1;
    }
    else showEndScreen();
}

function playerBWin() {
    let scorePlayerB = document.getElementById("score-b");

    if (currentBalls > 0){
        // player A lost.
        tableFootballData.scoreB += 1;
        scorePlayerB.innerHTML = tableFootballData.scoreB.toString();
        // reset the ball;
        tableFootballData.ball.x = 150;
        tableFootballData.ball.y = 100;

        tableFootballData.ball.directionX = 1;
    }
    else showEndScreen();
}

function showEndScreen() {
    // Hide Game Screen
    let gameScreen = document.getElementById("game");
    gameScreen.style.display = "none";

    let endScreen = document.getElementById("gameOver");
    endScreen.style.display = "inline-block";
    let msg = document.createTextNode("The game is over");
    endScreen.appendChild(msg);

    // Show End Screen
}