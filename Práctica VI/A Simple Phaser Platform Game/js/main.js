let game;

let wfConfig = {
        active: function () {
        startGame();
    },

    google: {
        families: ['Rammetto One', 'Sniglet', 'Liu Jian Mao Cao']
    },

    custom: {
        families: ['FerrumExtracondensed', 'Indigo Demon'],
        urls: ["https://fontlibrary.org/face/ferrum", "../assets/fonts/indigodemon.ttf"]
    }
};

WebFont.load(wfConfig);

function startGame() {
    game = new Phaser.Game(800, 600, Phaser.CANVAS, 'platformGameStage');

    // Welcome Screen
    game.state.add('welcome', initialState);
    // About Screen
    game.state.add('about', aboutState);
    // Config Screen
    game.state.add('config', configState);
    // Play Screen
    game.state.add('play', playState);

    game.state.start('welcome');

    // Add the instruction required to start the 'welcome' state
}