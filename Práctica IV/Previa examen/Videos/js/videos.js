const GAME_AREA_WIDTH = 800;
const GAME_AREA_HEIGHT = 600;
const BG_COLOR = "#FFFFFF";
const GAP = 10;

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
function preloadAssets() {}

function initGame() {}

function updateGame() {}

// Entry point
window.onload = startGame;

function startGame() {
    game.state.add('main', mainState);
    game.state.start('main');
}

