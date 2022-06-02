


let overState = {
    preload: loadAssets,
    create: gameOverScreen
};

let btnWelcome, btnPlay2;


function loadAssets() {
    game.load.image('bg', 'assets/imgs/bgLayer.jpg');
    game.load.image('sad', 'assets/imgs/sad.jpg');
}

function gameOverScreen(){
    game.add.image(0, 0, 'bg');
    //game.add.image(0, 0, 'sad');

    let textGameOver = 'You couldn`t make it';
    let styleTitle = {
        font: 'Rammetto One',
        fontSize: '22pt',
        fontWeight: 'bold',
        fill: '#b60404'
    };
    game.add.text(50, game.world.height / 6, textGameOver, styleTitle);

    btnWelcome = game.add.button(game.world.width / 1.75, game.world.height / 3 + 120,
        'configButton', onWelcomePressed);
    btnPlay2 = game.add.button(game.world.width / 1.75, game.world.height / 3 + 240,
        'playButton', onPlayButtonPressed2);
}

function onWelcomePressed() {
    // Add the instruction required to start the 'config' state
    game.state.start('welcome');
}

function onPlayButtonPressed2() {
    // Add the instruction required to start the 'play' state
    game.state.start('play');
}