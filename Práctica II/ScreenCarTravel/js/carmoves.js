class Car {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    };
};

let myGame = {};
myGame.carIsMoving = false;
myGame.gameIsOver = false;
myGame.carImage;
myGame.car;
myGame.canvas;
myGame.context;
myGame.timer;

// Entry point
window.onload = function () {
    myGame.init();
};

myGame.init = function () {
    // Hide all game layers and display the start screen
    myGame.hideAllScreens();
    document.getElementById("gamestartscreen").style.display = 'inline';
    // Get handler for game canvas and context
    myGame.canvas = document.getElementById("gamecanvas");
    myGame.context = myGame.canvas.getContext("2d");
};

myGame.hideAllScreens = function () {
    layers = document.getElementsByClassName("gamelayer");
    for ( let i = 0 ; i < layers.length ; i++ )
        layers[i].style.display = 'none';
};

myGame.showCanvas = function () {
    myGame.hideAllScreens();
    document.getElementById("gamecanvas").style.display = 'inline';
    myGame.play();
};

myGame.showEnd = function () {
    myGame.hideAllScreens();
    document.getElementById("endingscreen").style.display = 'inline';
    clearInterval(myGame.timer);
};

myGame.play = function () {
    myGame.car = new Car(0,270);
    myGame.carImage = new Image();
    myGame.carImage.src = 'images/car.png';

    myGame.carImage.onload = function () {
        myGame.context.drawImage(myGame.carImage, myGame.car.x, myGame.car.y);
    };

    myGame.mouseClick();
    // set interval to call gameloop in 50 FPS
    myGame.timer = setInterval(myGame.gameLoop, 1000/50);
};

myGame.mouseClick = function () {
    // Add Mouse Event Listener to canvas
    myGame.canvas.addEventListener("mousedown", function(e) {
        let mouseX = e.pageX - this.offsetLeft;
        let mouseY = e.pageY - this.offsetTop;

        if (mouseX >= myGame.car.x && mouseX <= myGame.car.x + myGame.carImage.naturalWidth &&
            mouseY >= myGame.car.y && mouseY <= myGame.car.y + myGame.carImage.naturalHeight)
            myGame.carIsMoving = !myGame.carIsMoving;
    });
};

myGame.gameLoop = function () {
    if ( !myGame.gameIsOver && myGame.carIsMoving ) {
        myGame.context.clearRect(myGame.car.x, myGame.car.y, myGame.carImage.naturalWidth, myGame.carImage.naturalHeight);
        myGame.car.x += 2;
        if (myGame.car.x >= myGame.canvas.width) {
            myGame.gameIsOver = true;
            myGame.showEnd();
        }
        else
            myGame.context.drawImage(myGame.carImage, myGame.car.x, myGame.car.y);
    }
};
