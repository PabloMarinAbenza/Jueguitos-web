const GAME_AREA_WIDTH = 1280;
const GAME_AREA_HEIGHT = 720;
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
    // 1. Loading the video file
    game.load.video("johnc", "assets/video/JohnCenaIntro.mp4");
    game.load.image("play", "assets/imgs/play.png");
    game.load.image("stop", "assets/imgs/stop.png");
}

function initGame() {

    // 2. Creating the video object
    video = game.add.video("johnc");
    // 3. Adding the video to the game world
    video.addToWorld(0, 0, 0, 0, 0.7, 0.7);
    // 4. Playing the video
    video.play();

    buttonPlay = game.add.button(420, 600, "play", playVideo);
    buttonPlay.visible = false;

    buttonStop = game.add.button(420, 600, "stop", stopVideo);
    buttonMute = game.add.button(
        buttonStop.x+buttonStop.width+160, // x
        buttonStop.y, // y
        "play", // image key
        muteVideo); // handler
}

function updateGame() {
}

function playVideo(){
    video.play();
    buttonPlay.visible = false;
    buttonStop.visible = true;
}

function stopVideo(){
    video.stop();
    buttonPlay.visible = true;
    buttonStop.visible = false;

}

function muteVideo(){
    video.volume = 0;
}

// Entry point
window.onload = startGame;

function startGame() {
    game.state.add('main', mainState);
    game.state.start('main');
}