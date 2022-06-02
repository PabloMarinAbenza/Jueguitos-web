//OTHER PLAY STATE
let previousState = 'other';

let otherPlayState = {
    preload: preloadOther,
    create: createOther,
    update: updateOther
}

function preloadOther() {
    game.load.image('craft','assets/imgs/craft.png');
    game.load.image('stars','assets/imgs/stars.png');
    game.load.image('laser','assets/imgs/laser.png');
    game.load.audio('sndlaser','assets/snds/laser.wav');
    game.load.image('ufo','assets/imgs/ufo.png');
    game.load.spritesheet('blast','assets/imgs/blast.png',128,128);
    game.load.audio('sndblast','assets/snds/blast.wav');
    game.load.image('asteroid','assets/imgs/cena.png');
}

function createOther() {
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
    createAsteroids(ASTEROIDS_GROUP_SIZE);

    createHUD();
}

function updateOther() {
    game.physics.arcade.overlap(lasers,ufos,laserHitsUfo,null,this); // UFO Collisions
    game.physics.arcade.overlap(craft,ufos,ufoHitsCraft,null,this);
    game.physics.arcade.overlap(lasers,asteroids,laserHitsAsteroid,null,this); // Asteroid Collisions
    game.physics.arcade.overlap(craft,asteroids,asteroidHitsCraft,null,this);

    manageCraftMovements();
    stars.tilePosition.y += 1;
    manageCraftShots();
}

function resetMember(item) {
    item.kill();
}

function createLasers(number) {
    lasers = game.add.group();
    lasers.enableBody = true;
    lasers.createMultiple(number, 'laser');
    lasers.callAll('events.onOutOfBounds.add','events.onOutOfBounds', resetMember);
    lasers.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    lasers.setAll('checkWorldBounds', true);
}

function createHUD() {
    let scoreX = 5;
    let levelX = game.world.width / 2;
    let livesX = game.world.width - 5;
    let allY = game.world.height - 25;
    let styleHUD = {fontSize: '18px', fill: '#FFFFFF'};
    scoreText = game.add.text(scoreX,allY,'Score: '+score,styleHUD);
    levelText = game.add.text(levelX,allY,'Level: '+level,styleHUD);
    levelText.anchor.setTo(0.5, 0);
    livesText = game.add.text(livesX,allY,'Lives: '+lives,styleHUD);
    livesText.anchor.setTo(1, 0);
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

function createAsteroids(number) {
    asteroids = game.add.group();
    asteroids.enableBody = true;
    asteroids.createMultiple(number, 'asteroid');
    asteroids.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetMember);
    asteroids.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    asteroids.setAll('checkWorldBounds', true);
    currentAsteroidProbability = LEVEL_ASTEROIDS_PROBABILITY[level-1];
    currentAsteroidVelocity = LEVEL_ASTEROIDS_VELOCITY[level-1];
    game.time.events.loop(TIMER_RHYTHM, activateAsteroid, this);

    //Math.floor(Math.random()
}

function activateUfo() {
    if (Math.random() < currentUfoProbability) {
    let ufo = ufos.getFirstExists(false);
    if (ufo) {
            let gw = game.world.width;
            let uw = ufo.body.width;
            let w = gw - uw;
            let x = Math.floor(Math.random()*w);
            let z = ufo.body.width / 2 + x;
            ufo.reset(z, 0);
            ufo.body.velocity.x = 0;
            ufo.body.velocity.y = currentUfoVelocity;
        }
    }
}

function activateAsteroid() {
    if (Math.random() < currentAsteroidProbability) {
        let asteroid = asteroids.getFirstExists(false);
        if (asteroid) {
            let gw = game.world.width;
            let aw = asteroid.body.width;
            let w = gw - aw;
            let x = Math.floor(Math.random()*w);
            let z = asteroid.body.width / 2 + x;
            asteroid.angle = Math.floor(Math.random()*360);
            let aux = Math.floor(Math.random()*asteroid.body.width);
            asteroid.width = aux;
            asteroid.height = aux;
            asteroid.reset(z, 0);
            asteroid.body.velocity.x = 0;
            asteroid.body.velocity.y = currentAsteroidVelocity;
        }
    }
}

function createSounds() {
    soundLaser = game.add.audio('sndlaser');
    soundBlast = game.add.audio('sndblast');
}

function createKeyControls() {
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function laserHitsUfo(laser, ufo) {
    ufo.kill();
    laser.kill();
    displayBlast(ufo);
    soundBlast.play();

    score++;
    scoreText.text = 'Score: '+score;

    if (level < NUM_LEVELS && score===level*HITS_FOR_LEVEL_CHANGE) {
        level++;
        levelText.text = 'Level: ' + level;
        currentUfoProbability =
        LEVEL_UFO_PROBABILITY[level-1];
        currentUfoVelocity = LEVEL_UFO_VELOCITY[level-1];
    }
}

function laserHitsAsteroid(laser, asteroid) {
    asteroid.kill();
    laser.kill();
    soundBlast.play();

    score++;

    if (level < NUM_LEVELS && score===level*HITS_FOR_LEVEL_CHANGE) {
        level++;
        levelText.text = 'Level: ' + level;
        currentAsteroidProbability = LEVEL_ASTEROID_PROBABILITY[level-1];
        currentAsteroidVelocity = LEVEL_ASTEROID_VELOCITY[level-1];
    }
}

function ufoHitsCraft(craft, ufo) {
    ufo.kill();
    craft.kill();
    displayBlast(ufo);
    displayBlast(craft);
    soundBlast.play();

    lives--;
    livesText.text = 'Lives: '+lives;

    ufos.forEach(clearStage, this); //Spacecraft replacement
    lasers.forEach(clearStage, this);
    game.input.enabled = false;
    currentUfoProbability = -1;
    game.time.events.add(2000, continueGame, this);
}

function asteroidHitsCraft(craft, asteroid) {
    asteroid.kill();
    craft.kill();
    displayBlast(asteroid);
    displayBlast(craft);
    soundBlast.play();

    lives--;
    livesText.text = 'Lives: '+lives;

    asteroids.forEach(clearStage, this); //Spacecraft replacement
    lasers.forEach(clearStage, this);
    game.input.enabled = false;
    currentAsteroidProbability = -1;
    game.time.events.add(2000, continueGame, this);
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
        cursors.up.reset();
        cursors.down.reset();
        currentUfoProbability =
        LEVEL_UFO_PROBABILITY[level-1];
    }
    else startHOF();
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
    if (laserLeft || laserRight) soundLaser.play();
}

function shootLaser(x, y, vy) {
    let shot = lasers.getFirstExists(false);
    if (shot) {
    shot.reset(x, y);
    shot.body.velocity.y = vy;
    }
    return shot;
}

function displayBlast(ship) {
    let blast = blasts.getFirstExists(false);
    let x = ship.body.center.x;
    let y = ship.body.center.y;
    blast.reset(x, y);
    blast.play('blast', 30, false, true);
}

function manageCraftMovements() {
    craft.body.velocity.x = 0;
    craft.body.velocity.y = 0;
    if (cursors.left.isDown || game.input.speed.x < 0)
        craft.body.velocity.x = -CRAFT_VELOCITY;
    else if (cursors.right.isDown || game.input.speed.x > 0)
        craft.body.velocity.x = CRAFT_VELOCITY;
    else if (cursors.up.isDown || game.input.speed.y < 0)
        craft.body.velocity.y = -CRAFT_VELOCITY;
    else if ((cursors.down.isDown || game.input.speed.y > 0) && (craft.y < game.world.height - HUD_HEIGHT))
        craft.body.velocity.y = CRAFT_VELOCITY;
}

function startHOF() {
    game.state.start('hof');
}

function createCraft() {
    let x = game.world.centerX;
    let y = game.world.height - HUD_HEIGHT;
    craft = game.add.sprite(x, y, 'craft');
    craft.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(craft);
    craft.body.collideWorldBounds = true;
}