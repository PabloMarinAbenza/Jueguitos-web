let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {
    
}

function createPlay() {
    startHOF();
}

function updatePlay() {
    
}

function startHOF() {
    game.state.start('hof');
}
