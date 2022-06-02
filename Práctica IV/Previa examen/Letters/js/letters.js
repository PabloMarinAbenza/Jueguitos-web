const GAME_AREA_WIDTH = 400;
const GAME_AREA_HEIGHT = 400;
const BG_COLOR = "#4488AA";

// game instance
let game = new Phaser.Game(GAME_AREA_WIDTH, GAME_AREA_HEIGHT,
    Phaser.CANVAS, "game");

// state's phases
let mainState = {
    preload: preloadAssets,
    create: initGame,
    update: updateGame
};

// methods for each phase of the state
function preloadAssets() {
    game.load.image("logo", "assets/imgs/uji.png");
}

function initGame() {
    game.stage.backgroundColor = BG_COLOR;

    logoImg = game.add.image(0, 0, "logo");
    logoImg.scale.setTo(0.2);
}

function updateGame() {}

// Entry point
window.onload = startGame;

function startGame() {
    game.state.add('main', mainState);
    game.state.start('main');
}