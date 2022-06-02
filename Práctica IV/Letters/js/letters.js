const GAME_AREA_WIDTH = 400;
const GAME_AREA_HEIGHT = 400;
const BG_COLOR = "#4488AA";
let hitsNumb;
let hitsUHD;
const HITS_MIN = 5;

// game instance
let game = new Phaser.Game(GAME_AREA_WIDTH, GAME_AREA_HEIGHT, Phaser.CANVAS, "game");

// state's phases
let mainState = {
    preload: preloadAssets,
    create: initGame,
    update: updateGame
};

// methods for each phase of the state
function preloadAssets() {
    game.load.image("logo", "assets/imgs/uji.png");
    game.load.image("play", "assets/imgs/play.png");
    game.load.image("stop", "assets/imgs/stop.png");
    game.load.audio("ost", "assets/audio/LavenderTown.mp3");
}

function initGame() {
    game.stage.backgroundColor = BG_COLOR;
    game.input.keyboard.onDownCallback = getKeyboardInput;

    letters = game.add.group();
    letters.inputEnableChildren = true;

    logoImg = game.add.image(0, 0, "logo");
    logoImg.scale.setTo(0.2);

    hitsNumb = 0;
    hitsUHD = game.add.text(10, 60, "Hits: ", '#FFFFFF');

    music = game.add.audio("ost");

    music.loop = true;
    music.play();
}

function getKeyboardInput(e) {
    if (e.keyCode >= Phaser.Keyboard.A && e.keyCode <= Phaser.Keyboard.Z) {
        let a = game.add.text(Math.random() * game.width, Math.random() * game.height,
            e.key, {
                fontSize: '40px',
                fill: '#FA2'
            }, letters); // group to add to
        a.anchor.setTo(0.5, 0.5); // 0.5 for the center
    }
}

function updateGame() {
    moveLogo();
    letters.onChildInputDown.add(processLetter);
    //removeLetters();
    shakeLetters();
    hitsUHD.text = "Hits: " + hitsNumb; //updateScore()
    checkGameOver();
}

function removeLetters() {
    const DIST_THRESH = 50;
    if (game.input.activePointer.isDown) {
        let xPointer = game.input.x;
        let yPointer = game.input.y;
        for (const letter of letters.children) {
            let x = game.input.x
            let y = game.input.y
            let d = 0;
            if (d <= DIST_THRESH){
                processLetter(letter);
            }
        }
    }
}

function processLetter(item, pointer) {
    hitsNumb = hitsNumb + 1;
    item.destroy(); // frees up memory
    // kill() removes it from display list,
    // but not from the group
}

function shakeLetters() {
    for (const child of letters.children) {
        child.x += Math.random() * 2 - 1;
        child.y += Math.random() * 2 - 1;
        child.angle += Math.random() * 10 - 5;
    }
}

function moveLogo() {
    logoImg.x += 1;
    if (logoImg.x > game.width) logoImg.x = 0 - logoImg.width;
}

// Entry point
window.onload = startGame;

function startGame() {
    game.state.add('main', mainState);
    game.state.add('over', overState);
    game.state.start('main');
}

function checkGameOver(){
    if (hitsNumb >= HITS_MIN){
        game.state.start('over');
        music.stop();
    }
}