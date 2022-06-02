const HUD_HEIGHT = 50;
const CRAFT_VELOCITY = 150;
const LASERS_GROUP_SIZE = 40;
const LEFT_LASER_OFFSET_X = 11;
const RIGHT_LASER_OFFSET_X = 12;
const LASERS_OFFSET_Y = 10;
const LASERS_VELOCITY = 500;
const UFOS_GROUP_SIZE = 200;
const PLASMA_GROUP_SIZE = 40; //CAMBIO
const TIMER_RHYTHM = 0.1 * Phaser.Timer.SECOND;
const BLASTS_GROUP_SIZE = 30;
const NUM_LEVELS = 5;
const LEVEL_UFO_PROBABILITY = [0.2, 0.4, 0.6, 0.8, 1.0];
const LEVEL_UFO_VELOCITY = [50, 100, 150, 200, 250];
const HITS_FOR_LEVEL_CHANGE = 50;
const VEL_PLASMA = 100;  //CAMBIO
let cont = 0;
let craft;
let cursors;
let stars;
let lasers;
let fireButton;
let soundLaser;
let ufos;
let plasmas;//CAMBIO
let currentUfoProbability;
let currentUfoVelocity;
let blasts;
let soundBlast;
let score;
let scoreText;
let level;
let levelText;
let lives;
let livesText;
let inhibition = false;

let playState = {
    preload: preloadPlay,
    create: createPlay,
    update: updatePlay
};

function preloadPlay() {
    game.load.image('craft', 'assets/imgs/craft.png');
    game.load.image('stars', 'assets/imgs/stars.png');
    game.load.image('laser', 'assets/imgs/laser.png');
    game.load.audio('sndlaser', 'assets/snds/laser.wav');
    game.load.image('ufo', 'assets/imgs/ufo.png');
    game.load.image('plasma', 'assets/imgs/plasma.png');//CAMBIO
    game.load.spritesheet('blast', 'assets/imgs/blast.png', 128, 128);
    game.load.audio('sndblast', 'assets/snds/blast.wav');
}

function createPlay() {
    score = 0;
    level = 1;
    lives = 3;
    let w = game.world.width;
    let h = game.world.height;
    stars = game.add.tileSprite(0, 0, w, h, 'stars');
    createCraft();
    createKeyControls();
    createLasers(LASERS_GROUP_SIZE);
    createSounds();
    createBlasts(BLASTS_GROUP_SIZE);
    createUfos(UFOS_GROUP_SIZE);
    createPlasmas(PLASMA_GROUP_SIZE);//CAMBIO
    createHUD();
}

function createHUD() {
    let scoreX = 5;
    let levelX = game.world.width / 2;
    let livesX = game.world.width - 5;
    let allY = game.world.height - 25;
    let styleHUD = {fontSize: '18px', fill: '#FFFFFF'};
    scoreText = game.add.text(scoreX, allY, 'Score: ' + score, styleHUD);
    levelText = game.add.text(levelX, allY, 'Level: ' + level, styleHUD);
    levelText.anchor.setTo(0.5, 0);
    livesText = game.add.text(livesX, allY, 'Lives: ' + lives, styleHUD);
    livesText.anchor.setTo(1, 0);
}

function createUfos(number) {
    ufos = game.add.group();
    ufos.enableBody = true;
    ufos.createMultiple(number, 'ufo');
    ufos.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    ufos.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    ufos.setAll('checkWorldBounds', true);
    currentUfoProbability = LEVEL_UFO_PROBABILITY[level-1];
    currentUfoVelocity = LEVEL_UFO_VELOCITY[level-1];
    game.time.events.loop(TIMER_RHYTHM, activateUfo, this);
}

function createPlasmas(number) {//CAMBIO
    plasmas = game.add.group();
    plasmas.enableBody = true;
    plasmas.createMultiple(number, 'plasma');
    plasmas.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    plasmas.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    //plasmas.setAll('checkWorldBounds', true); //Por lo que entiendo del enunciado es que tengas esto activado,
                                                //pero si lo tienes activado no te pueden aparecer en los lados
                                                //del gameworld, así que puede ser que esto esté mal pero yo lo veo
                                                //bonito, así que suspenderé y ya está xd
    game.time.events.loop(TIMER_RHYTHM, activatePlasma, this);
}

function activatePlasma() {//CAMBIO
    if (Math.random() < 0.1) {
        let plasma = plasmas.getFirstExists(false);
        if (plasma) {
            //posiciones
            let gw = game.world.width;
            let gh = game.world.height;
            let x = Math.floor(Math.random() * (gw+gh/2)-gh/2);
            let y = 0;
            plasma.reset(x,y);
            game.physics.arcade.enable(plasma);

            //velocidades
            let v= VEL_PLASMA;
            let d = Math.sqrt(Math.pow(x-craft.x,2)+Math.pow(y-craft.y,2));
            let vx = -(x-craft.x)/d*v;
            let vy = -(y-craft.y)/d*v;
            plasma.body.velocity.x = vx;
            plasma.body.velocity.y = vy;
        }
    }
}

function activateUfo() {
    if (Math.random() < currentUfoProbability) {
        let ufo = ufos.getFirstExists(false);
        if (ufo) {
            let gw = game.world.width;
            let uw = ufo.body.width;
            let w = gw - uw;
            let x = Math.floor(Math.random() * w);
            let z = ufo.body.width / 2 + x;
            ufo.reset(z, 0);
            ufo.body.velocity.x = 0;
            ufo.body.velocity.y = currentUfoVelocity;
        }
    }
}

function createBlasts(number) {
    blasts = game.add.group();
    blasts.createMultiple(number, 'blast');
    blasts.forEach(setupBlast, this);
}

function setupBlast(blast) {
    blast.anchor.x = 0.5;
    blast.anchor.y = 0.5;
    blast.animations.add('blast');
}

function createSounds() {
    soundLaser = game.add.audio('sndlaser');
    soundBlast = game.add.audio('sndblast');
}

function createLasers(number) {
    lasers = game.add.group();
    lasers.enableBody = true;
    lasers.createMultiple(number, 'laser');
    lasers.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    lasers.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    lasers.setAll('checkWorldBounds', true);
}

function resetMember(item) {
    item.kill();
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function createCraft() {
    let x = game.world.centerX;
    let y = game.world.height - HUD_HEIGHT;
    craft = game.add.sprite(x, y, 'craft');
    craft.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable(craft);
    craft.body.collideWorldBounds = true;
}

function updatePlay() {
    game.physics.arcade.overlap(lasers, ufos, laserHitsUfo, null, this);
    game.physics.arcade.overlap(craft, ufos, ufoHitsCraft, null, this);
    game.physics.arcade.overlap(craft, plasmas, plasmaHitsCraft, null, this); //CAMBIO
    stars.tilePosition.y += 1;
    craft.body.velocity.x = 0;
    manageCraftMovements();
    if(!inhibition){ //CAMBIO
        manageCraftShots();
    }
}

function laserHitsUfo(laser, ufo) {
    ufo.kill();
    laser.kill();
    displayBlast(ufo);
    soundBlast.play();
    score++;
    scoreText.text = 'Score: ' + score;
    if (level < NUM_LEVELS && score === level * HITS_FOR_LEVEL_CHANGE) {
        level++;
        levelText.text = 'Level: ' + level;
        currentUfoProbability = LEVEL_UFO_PROBABILITY[level-1];
        currentUfoVelocity = LEVEL_UFO_VELOCITY[level-1];
    }
}

function ufoHitsCraft(craft, ufo) {
    ufo.kill();
    craft.kill();
    displayBlast(ufo);
    displayBlast(craft);
    soundBlast.play();
    lives--;
    livesText.text = 'Lives: ' + lives;
    ufos.forEach(clearStage, this);
    lasers.forEach(clearStage, this);
    plasmas.forEach(clearStage, this);
    game.input.enabled = false;
    currentUfoProbability = -1;
    game.time.events.add(2000, continueGame, this);
}

function plasmaHitsCraft(craft, plasma) { //CAMBIO
    plasma.kill();
    inhibition = true;
    game.time.events.add(2000, inhibitionchange, this);
}

function inhibitionchange(){ //CAMBIO
    inhibition = false;
}

function clearStage(item) {
    item.kill();
}

function continueGame() {
    game.input.enabled = true;
    if (lives > 0) {
        let x = game.world.centerX;
        let y = game.world.height - HUD_HEIGHT;
        craft.reset(x, y);
        cursors.left.reset();
        cursors.right.reset();
        currentUfoProbability = LEVEL_UFO_PROBABILITY[level-1];
    }
    else
        startEnd();
}

function displayBlast(ship) {
    let blast = blasts.getFirstExists(false);
    let x = ship.body.center.x;
    let y = ship.body.center.y;
    blast.reset(x, y);
    blast.play('blast', 30, false, true);
}

function manageCraftShots() {
    if (fireButton.justDown || game.input.mousePointer.leftButton.justPressed(30))
        fireLasers();
}

function fireLasers() {
    let lx = craft.x - LEFT_LASER_OFFSET_X;
    let rx = craft.x + RIGHT_LASER_OFFSET_X;
    let y = craft.y - LASERS_OFFSET_Y;
    let vy = -LASERS_VELOCITY;
    let laserLeft = shootLaser(lx, y, vy);
    let laserRight = shootLaser(rx, y, vy);
    if (laserLeft || laserRight)
        soundLaser.play();
}

function shootLaser(x, y, vy) {
    let shot = lasers.getFirstExists(false);
    if (shot) {
        shot.reset(x, y);
        shot.body.velocity.y = vy;
    }
    return shot;
}

function manageCraftMovements() {
    craft.body.velocity.x = 0;
    if (cursors.left.isDown || game.input.speed.x < 0)
        craft.body.velocity.x = -CRAFT_VELOCITY;
    else if (cursors.right.isDown || game.input.speed.x > 0)
        craft.body.velocity.x = CRAFT_VELOCITY;
}

function startEnd() {
    game.state.start('end'); //CAMBIO
}
