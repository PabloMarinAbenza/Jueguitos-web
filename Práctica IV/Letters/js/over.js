let capguy;

let overState = {
    preload: preloadGameOver,
    create: createOver
};

function createOver(){
    game.stage.backgroundColor = '#FFD700';
    gameOverText = game.add.text(10, 20, "Game complete!", '#00FFFF');
    hitsRecordText = game.add.text(10, 50, "You got " + hitsNumb + " hits", '#00FFFF');
    retryText = game.add.text(10, 80, "Click to play again", '#00FFFF');

    retryText.inputEnabled = true;
    retryText.events.onInputDown.add(startGame);

    // sprite
    capguy = game.add.sprite(0, 180, 'cityscene', 'capguy/walk/0001');
    capguy.scale.setTo(0.5,0.5);

    // animation
    capguy.animations.add('walk', Phaser.Animation.generateFrameNames('capguy/walk/', 1, 8, '', 4), 50, true, false);
    capguy.animations.play('walk');
}

function preloadGameOver(){
    game.load.atlasJSONHash('cityscene', 'assets/atlas/cityscene.png', 'assets/atlas/cityscene.json');
}