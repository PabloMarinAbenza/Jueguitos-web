let startState = {
    preload: preloadStart,
    create: createStart,
    update: updateStart
};

//variables
let buttonlevel1;
let buttonlevel2;
let buttonlevel3;
let aboutButton;
let titleStart;
let fondoTierra;
let fondoEspacioMov;
let soundmusica;

function preloadStart(){
    game.load.image('buttonlevel1','assets/imgs/buttonlvl1.png');
    game.load.image('buttonlevel2','assets/imgs/buttonlvl2.png');
    game.load.image('buttonlevel3','assets/imgs/buttonlvl3.png');
    game.load.image('aboutButton','assets/imgs/about.png');
    game.load.image('titleStart','assets/imgs/titleStart.png');
    game.load.image('fondoStart','assets/imgs/fondoTierra.png');
    game.load.image('fondoEspacioMov','assets/imgs/fondoEspacioMov.png');
    game.load.audio('musica','assets/snds/musica_j.wav');
}
function createStart(){
    createImg();
    createSoundsstart();
    createButtonsGame();
}
function createSoundsstart() {
    soundmusica = game.add.audio('musica',0.3);
    soundmusica.loop=true;
    soundmusica.play();
}
function createButtonsGame(){
    //level1Button
    buttonlevel1 = game.add.button(game.world.width*0.5, game.world.height*0.6, 'buttonlevel1',startLvl1);
    buttonlevel1.anchor.setTo(0.5, 0.5);
    buttonlevel1.scale.setTo(0.3, 0.3);
    //level2Button
    buttonlevel2 = game.add.button(game.world.width*0.5, game.world.height*0.7, 'buttonlevel2',startLvl2);
    buttonlevel2.anchor.setTo(0.5, 0.5);
    buttonlevel2.scale.setTo(0.3, 0.3);
    //level3Button
    buttonlevel3 = game.add.button(game.world.width*0.5, game.world.height*0.8, 'buttonlevel3',startLvl3);
    buttonlevel3.anchor.setTo(0.5, 0.5);
    buttonlevel3.scale.setTo(0.3, 0.3);
    //aboutButton
    aboutButton = game.add.button(game.world.width*0.75, game.world.height*0.95, 'aboutButton',aboutScreen)
    aboutButton.anchor.setTo(0.25, 0.25);
    aboutButton.scale.setTo(0.15, 0.15);
}
function startLvl1(){
    game.state.start('level1');
}
function startLvl2(){
    game.state.start('level2');
}
function startLvl3(){
    game.state.start('level3pre');
}
function aboutScreen() {
    game.state.start('about');
}
function createImg(){
    let w = game.world.width;
    let h = game.world.height;
    fondoEspacioMov = game.add.tileSprite(0, 0, w, h, 'fondoEspacioMov');

    titleStart = game.add.sprite(game.world.width*0.5, game.world.height*0.2, 'titleStart');
    titleStart.anchor.setTo(0.5, 0.5);
    titleStart.scale.setTo(0.7, 0.7);

    fondoTierra = game.add.sprite(w/20, h/1.8, 'fondoStart');
    fondoTierra.anchor.setTo(0.3, 0.3);
    fondoTierra.scale.setTo(1, 1);
}
function updateStart(){
    fondoEspacioMov.tilePosition.x += 1;
}
let level3State = {
    preload: preloadlevel3,
    create: createlevel3,
    update: updatelevel3
};
const JSONP3='assets/levels/level3.json';
const S_SPEEDUP=4;
let jsonvar3;
let ultimateHUD;
let sndult;
const ULTIMATE_RANGE=256;
const ULT_GROUP_SIZE=20;
function preloadlevel3(){
    game.load.text('json3', JSONP3, true);
    game.load.image('typist','assets/imgs/craft_2.png');
    game.load.image('stars','assets/imgs/stars.png');
    game.load.image('laser','assets/imgs/laser_2.png');
    game.load.image('sufo','assets/imgs/sufo2.png');
    game.load.image('ufo','assets/imgs/ufo2.png');
    game.load.spritesheet('blast','assets/imgs/blast_2.png',128,128);
    game.load.audio('sndlaser','assets/snds/laser.wav');
    game.load.audio('finalwavesnd','assets/snds/finalwave.wav');
    game.load.audio('sndult','assets/snds/ult.wav');
    game.load.spritesheet('ult','assets/imgs/ulti.png',128,128);
}
function createlevel3(){
    level=3;
    charge=0;
    won=false;
    let w = game.world.width;
    let h = game.world.height;
    jsonvar3=JSON.parse(game.cache.getText('json3'));
    lastwave=0;
    for (k in jsonvar3.wave) {
        lastwave++;
    }
    game.input.keyboard.onDownCallback = getKeyboardInput;
    hits=0;
    totalshots=0;
    reangulate_incd=false;
    owpArry=[];
    selfvelocity=0;

    wave=1;
    active=-1;
    stars = game.add.tileSprite(0, 0, w, h, 'stars');
    ultimateHUD = game.add.text(GAME_STAGE_WIDTH-80,GAME_STAGE_HEIGHT-GAME_HUD_Y, 'Charge: '+charge,{fontSize: '12px', fill: '#FFF'});
    createTypist();
    lastx=typist.x;
    startwave3();

    game.time.events.loop(WORK_TIMER, workloop, this);
    createBlasts(BLASTS_GROUP_SIZE);
    createLasers(LASERS_GROUP_SIZE);
    createUlt(ULT_GROUP_SIZE);
    createSounds1();


}
function startwave3(){
    wavesetting=jsonvar3.wave[wave-1].wavesetting;
    speedwavejson=jsonvar3.wave[wave-1].speed;
    normarray=jsonvar3.wave[wave-1].arraynorm;
    reparray=jsonvar3.wave[wave-1].arrayreplicator;
    fanarray=jsonvar3.wave[wave-1].arrayfan;
    WORK_TIMER=jsonvar3.wave[wave-1].worktmr;
    normiterador=0;
    faniterador=0;
    repiterador=0;
    wavekills=0;
    active=-1;
    createEnemy3();
    //mostrar la PM de wave numero
    mostrarwave();
}
function createEnemy3(){
    game.time.events.repeat(TIMER_OWP, wavesetting.length, owpfabricator3, this);//esto revisar
}
function owpfabricator3(){
    if(wavesetting[0]=='n'){
        let tmpstring=normarray[normiterador++];
        let tmprnd=Math.floor(Math.random()*tmpstring.length);
        let newstring=tmpstring.substring(0,tmprnd).toUpperCase()+tmpstring.substring(tmprnd,tmpstring.lenght);
        owpArry.push(new owp(Math.floor(Math.random()*(GAME_STAGE_WIDTH-100)+50),50,'ufo', speedwavejson, /*normarray[normiterador++]*/newstring));
    } else if(wavesetting[0]=='f'){
        let tmpstring=fanarray[faniterador++];
        let tmprnd=Math.floor(Math.random()*tmpstring.length);
        let newstring=tmpstring.substring(0,tmprnd).toUpperCase()+tmpstring.substring(tmprnd,tmpstring.lenght);
        owpArry.push(new fanowp(Math.floor(Math.random()*(GAME_STAGE_WIDTH-100)+50),50,'ufo', speedwavejson, newstring));
    } else if(wavesetting[0]=='r'){
        let tmpstring=reparray[repiterador++];
        let tmprnd=Math.floor(Math.random()*tmpstring.length);
        let newstring=tmpstring.substring(0,tmprnd).toUpperCase()+tmpstring.substring(tmprnd,tmpstring.lenght);
        owpArry.push(new repowp(Math.floor(Math.random()*(GAME_STAGE_WIDTH-100)+50),50,'ufo', speedwavejson, newstring));
    } else if(wavesetting[0]=='s'){
        let tmpstring=normarray[normiterador++];
        let tmprnd=Math.floor(Math.random()*tmpstring.length);
        let newstring=tmpstring.substring(0,tmprnd).toUpperCase()+tmpstring.substring(tmprnd,tmpstring.lenght);
        owpArry.push(new shieldedowp(Math.floor(Math.random()*(GAME_STAGE_WIDTH-100)+50),50,'sufo', speedwavejson/2, newstring));//mismas palabras, solo que con escudo
    }
    wavesetting=wavesetting.substring(1);
}
function ultimate(){
    charge=charge-100;
    let iterador=0;
    displayUlt();
    //ultimate animation
    while(iterador<owpArry.length){
        if (Math.sqrt((owpArry[iterador].sprite.x-typist.x)**2+(owpArry[iterador].sprite.y-typist.y)**2)<ULTIMATE_RANGE/*owpArry[iterador].sprite.y>GAME_STAGE_HEIGHT/2*/){
            if(active==iterador){
                active=-1;
            }
            displayBlast(owpArry[iterador].sprite, owpArry[iterador].sprite.scale.x)
            owpArry[iterador].sprite.destroy();
            owpArry[iterador].text.destroy();
            owpArry.splice(iterador, 1);
            iterador--;
        }
        iterador++;
    }
    updatechargehud();
}
function updatelevel3(){
    stars.tilePosition.y += 1;
    stars.tilePosition.x += 1;
    if(!reangulate_incd && typist.x!=lastx && owpArry.length>0){
        owpArry.forEach(function(v,i,array){
            if(owpArry[i].sprite.body.velocity!=0){//con velocity 0 setangle falla
                owpArry[i].setangle();
            }
        });
        reangulate_incd=true;
        lastx=typist.x;
        game.time.events.add(reangulate_delay, function(){reangulate_incd=false;});
    }
    owpArry.forEach(function(v,i,array){
        owpArry[i].updateText();
        game.physics.arcade.overlap(typist,owpArry[i].sprite,typisthit,null,this);

        //game.physics.arcade.overlap(lasers,owpArry[i].sprite,laserHitsOwp,null,this);
    });
    if(active!=-1){
        game.physics.arcade.overlap(lasers,owpArry[active].sprite,laserHitsOwp2,null,this);
    }
    if(owpArry.length==0 && wavesetting==""){
        wave++;
        if(wave>lastwave){
            game.state.start('end');
            won=true;
        } else {
            startwave3();
        }

    }
    //rotar targeteado
    if(active>-1){
        typist.rotation=game.physics.arcade.angleBetween(typist, owpArry[active].sprite)+Math.PI/2;
    }
    //typist to mouse x
    typist.x=game.input.mousePointer.x;
    //swap shield sprite
    owpArry.forEach(function(v,i,array){
        if(owpArry[i].shielded){
            if(owpArry[i].sprite.y>GAME_STAGE_HEIGHT/2){
                owpArry[i].shielded=false;
                    //update sprite
                owpArry[i].sprite.loadTexture('ufo');
                owpArry[i].sprite.body.velocity.y=owpArry[i].sprite.body.velocity.y*S_SPEEDUP;
                owpArry[i].sprite.body.velocity.x=owpArry[i].sprite.body.velocity.x*S_SPEEDUP;
                owpArry[i].v=owpArry[i].v*S_SPEEDUP;
            }
        }
    });
}
function updatechargehud(){
    ultimateHUD.text='Charge: '+charge;
}
function displayUlt() {
    let ult = ults.getFirstExists(false);
    let x = typist.body.center.x;
    let y = typist.body.center.y;
    ult.reset(x, y);
    ult.play('ult', 30, false, true);
    sndult.play();

}
function createUlt(number) {
    sndult = game.add.audio('sndult');
    ults = game.add.group();
    ults.createMultiple(number, 'ult');
    ults.forEach(setupUlt, this);
    }
function setupUlt(ult) {
    ult.anchor.x = 0.5;
    ult.anchor.y = 0.5;
    ult.scale.x=4;
    ult.scale.y=4;
    ult.animations.add('ult');
}
let preState = {
    preload: preloadPre,
    create: createPre,
    update: updatePre
};

let preText;

function preloadPre(){
    game.load.image('level3Button','assets/imgs/skip.png');
    game.load.image('preText','assets/imgs/pretext.png');
    game.load.image('fondoMov','assets/imgs/stars.png');
}
function createPre(){
    let w = game.world.width;
    let h = game.world.height;
    fondoMov = game.add.tileSprite(0, 0, w, h, 'fondoMov');

    preText = game.add.sprite(0, 0, 'preText');
    preText.anchor.setTo(0, 0);
    preText.scale.setTo(0.39, 0.409);

    level3Button = game.add.button(game.world.width*0.75, game.world.height*0.95, 'level3Button',startlevel3)
    level3Button.anchor.setTo(0.25, 0.25);
    level3Button.scale.setTo(0.15, 0.15);
}
function updatePre(){
    fondoMov.tilePosition.y += 1;
    fondoMov.tilePosition.x += 1;
}

function startlevel3() {
    game.state.start('level3');
}
let level2State = {
    preload: preloadlevel2,
    create: createlevel2,
    update: updatelevel2
};

const JSONP2='assets/levels/level2.json';
let WORK_TIMER;
const tinyword='abcdefgjijklmnopqrstuvwxyz';//revisar esto y string lenght
const reangulate_delay=1000;
const STOP_TIME_ON_HIT=500;
let reangulate_incd;
let lastx;
let jsonvar2;
let normiterador;
let faniterador;
let repiterador;
let normarray;
let fanarray;
let reparray;
let selfvelocity;


function preloadlevel2(){
    game.load.text('json2', JSONP2, true);
    game.load.image('typist','assets/imgs/craft_2.png');
    game.load.image('stars','assets/imgs/stars.png');
    game.load.image('laser','assets/imgs/laser_2.png');
    game.load.image('ufo','assets/imgs/ufo2.png');
    game.load.spritesheet('blast','assets/imgs/blast_2.png',128,128);
    game.load.audio('sndlaser','assets/snds/laser.wav');
    game.load.audio('finalwavesnd','assets/snds/finalwave.wav');
}

function createlevel2(){
    level=2;
    won=false;
    let w = game.world.width;
    let h = game.world.height;
    jsonvar2=JSON.parse(game.cache.getText('json2'));
    lastwave=0;
    for (k in jsonvar2.wave) {
        lastwave++;
    }
    game.input.keyboard.onDownCallback = getKeyboardInput;
    hits=0;
    charge=0;
    totalshots=0;
    reangulate_incd=false;
    owpArry=[];
    selfvelocity=0;


    //porque no funciona crearlo aqui idk
    //wavetext=game.add.text(GAME_STAGE_WIDTH/2, 0, 'k',{fontSize: '32px', fill: '#FFF'});
    //wavetext.anchor.setTo(0.5, 0.5);
    //
    wave=1;
    active=-1;
    stars = game.add.tileSprite(0, 0, w, h, 'stars');

    createTypist();
    lastx=typist.x;
    startwave2();

    game.time.events.loop(WORK_TIMER, workloop, this);
    createBlasts(BLASTS_GROUP_SIZE);
    createLasers(LASERS_GROUP_SIZE);
    createSounds1();
}
function startwave2(){
    wavesetting=jsonvar2.wave[wave-1].wavesetting;
    speedwavejson=jsonvar2.wave[wave-1].speed;
    normarray=jsonvar2.wave[wave-1].arraynorm;
    reparray=jsonvar2.wave[wave-1].arrayreplicator;
    fanarray=jsonvar2.wave[wave-1].arrayfan;
    WORK_TIMER=jsonvar2.wave[wave-1].worktmr;
    normiterador=0;
    faniterador=0;
    repiterador=0;
    wavekills=0;
    active=-1;
    createEnemy2();
    //mostrar la PM de wave numero
    mostrarwave();
}
function updatelevel2(){
    stars.tilePosition.y += 1;
    stars.tilePosition.x += 1;
    if(!reangulate_incd && typist.x!=lastx && owpArry.length>0){
        owpArry.forEach(function(v,i,array){
            if(owpArry[i].sprite.body.velocity!=0){//con velocity 0 setangle falla
                owpArry[i].setangle();
            }
        });
        reangulate_incd=true;
        lastx=typist.x;
        game.time.events.add(reangulate_delay, function(){reangulate_incd=false;});
    }
    owpArry.forEach(function(v,i,array){
        owpArry[i].updateText();
        game.physics.arcade.overlap(typist,owpArry[i].sprite,typisthit,null,this);

        //game.physics.arcade.overlap(lasers,owpArry[i].sprite,laserHitsOwp,null,this);
    });
    if(active!=-1){
        game.physics.arcade.overlap(lasers,owpArry[active].sprite,laserHitsOwp2,null,this);
    }
    if(owpArry.length==0 && wavesetting==""){
        wave++;
        if(wave>lastwave){
            game.state.start('end');
            won=true;
        } else {
            startwave2();
        }

    }
    //rotar targeteado
    if(active>-1){
        typist.rotation=game.physics.arcade.angleBetween(typist, owpArry[active].sprite)+Math.PI/2;
    }
    //typist to mouse x
    typist.x=game.input.mousePointer.x;
}
function laserHitsOwp2(owp, laser){
    //funcion extra microdetener al owp
    laser.kill();
    if(selfvelocity==0){
        selfvelocity=owp.body.velocity;
        owp.body.velocity=0;
        game.time.events.add(STOP_TIME_ON_HIT, function(){
        if(active!=-1){
            owp.body.velocity=selfvelocity;
        }
        selfvelocity=0;});
    }
}
function createEnemy2(){
    game.time.events.repeat(TIMER_OWP, wavesetting.length, owpfabricator, this);//esto revisar
}
function owpfabricator(){
    if(wavesetting[0]=='n'){
        owpArry.push(new owp(Math.floor(Math.random()*(GAME_STAGE_WIDTH-100)+50),50,'ufo', speedwavejson, normarray[normiterador++]));
    } else if(wavesetting[0]=='f'){
        owpArry.push(new fanowp(Math.floor(Math.random()*(GAME_STAGE_WIDTH-100)+50),50,'ufo', speedwavejson, fanarray[faniterador++]));
    } else if(wavesetting[0]=='r'){
        owpArry.push(new repowp(Math.floor(Math.random()*(GAME_STAGE_WIDTH-100)+50),50,'ufo', speedwavejson, reparray[repiterador++]));
    }
    /*
    if(wavesetting.lenght>0){
    }
    */
    wavesetting=wavesetting.substring(1);
}
function workloop(){
    owpArry.forEach(function(v,i,array){
        owpArry[i].work();
    });
}
let level1State = {
    preload: preloadlevel1,
    create: createlevel1,
    update: updatelevel1
};


//let Wave1=["Cafetera", "Descafe", "tostadora"];

//tmp
const JSONP1='assets/levels/level1.json';
const TIMER_OWP=3000;
const DESVIO_ANGULAR=10;



let jsonvar1;
let variableswavejson;
let speedwavejson;
let wavelenght;



let owptextiterador;
let wavekills;
//tmp owp push
let tmp;
//
let active;

function preloadlevel1(){
    game.load.image('typist','assets/imgs/craft_2.png');
    game.load.image('stars','assets/imgs/stars.png');
    game.load.image('laser','assets/imgs/laser_2.png');
    game.load.image('ufo','assets/imgs/ufo2.png');
    game.load.text('json1', JSONP1, true);
    game.load.spritesheet('blast','assets/imgs/blast_2.png',128,128);
    game.load.audio('sndlaser','assets/snds/laser.wav');
    game.load.audio('finalwavesnd','assets/snds/finalwave.wav');
}
function startwave(){
    variableswavejson=jsonvar1.wave[wave-1].array;
    speedwavejson=jsonvar1.wave[wave-1].speed;
    wavelenght=jsonvar1.wave[wave-1].wavelenght;
    owptextiterador=0;
    wavekills=0;
    active=-1;

    createEnemy();
    //mostrar la PM de wave numero
    mostrarwave();
}

function createlevel1(){
    level=1;
    won=false;
    let w = game.world.width;
    let h = game.world.height;
    jsonvar1=JSON.parse(game.cache.getText('json1'));
    lastwave=0;
    for (k in jsonvar1.wave) {
        lastwave++;
    }
    game.input.keyboard.onDownCallback = getKeyboardInput;
    hits=0;
    charge=0;
    totalshots=0;
    //porque no funciona crearlo aqui idk
    //wavetext=game.add.text(GAME_STAGE_WIDTH/2, 0, 'k',{fontSize: '32px', fill: '#FFF'});
    //wavetext.anchor.setTo(0.5, 0.5);
    //
    wave=1;
    stars = game.add.tileSprite(0, 0, w, h, 'stars');

    createTypist();
    startwave();

    createBlasts(BLASTS_GROUP_SIZE);
    createLasers(LASERS_GROUP_SIZE);
    createSounds1();
}
function createSounds1() {
    soundLaser = game.add.audio('sndlaser');
}

function createEnemy(){
    //game.add.sprite(50, 50, 'ufo');
    //owpbasic.anchor.setTo(0.5, 0.5);
    //game.physics.arcade.enable(owpbasic);
    //owpbasic.body.collideWorldBounds = true;
    game.time.events.repeat(TIMER_OWP, wavelenght, owptimer, this);

    /*
    let newowp = new owp(50,50,'ufo', speedwavejson, variableswavejson[0]);
    owpArry.push(newowp);
    newowp = new owp(250,50,'ufo', speedwavejson, variableswavejson[2]);
    owpArry.push(newowp);
    */
}
function owptimer(){
    tmp=new owp(Math.floor(Math.random()*(GAME_STAGE_WIDTH-100)+50),50,'ufo', speedwavejson, variableswavejson[owptextiterador++]);
    owpArry.push(tmp);
}
function updatelevel1(){
    stars.tilePosition.y += 1;
    stars.tilePosition.x += 1;

    owpArry.forEach(function(v,i,array){
        owpArry[i].updateText();
        game.physics.arcade.overlap(typist,owpArry[i].sprite,typisthit,null,this);
    });
    if(active!=-1){
        game.physics.arcade.overlap(lasers,owpArry[active].sprite,laserHitsOwp,null,this);
    }

    if(wavekills==wavelenght){
        wave++;
        if(wave>lastwave){
            game.state.start('end');
            won=true;
            //entrada victoriosa
        } else {
            startwave();
        }

    }
    //rotar targeteado
    if(active>-1){
        typist.rotation=game.physics.arcade.angleBetween(typist, owpArry[active].sprite)+Math.PI/2;
    }
}
function laserHitsOwp(owp, laser){
    laser.kill();
}
const GAME_STAGE_WIDTH = 400;
const GAME_STAGE_HEIGHT = 700;
const GAME_HUD_Y=15;

let game = new Phaser.Game(GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT, Phaser.CANVAS, 'gamestage');
//game global variables andd functions
let won;


let stars;
let typist;
let owpArry=[];
let wave;
let lastwave;

let hits;
let totalshots;
let wavetext;

const BLASTS_GROUP_SIZE = 30;
let blasts;

const LASERS_GROUP_SIZE = 40;
const LASERS_OFFSET_Y = 10;
const LASERS_VELOCITY = 700;
let lasers;
let level;
let charge;

//global functions
function mostrarwave(){
    wavetext=game.add.text(GAME_STAGE_WIDTH/2, 0, 'WAVE '+wave,{fontSize: '32px', fill: '#FFF'});
    wavetext.alpha=0;
    //wavetext.text='WAVE' +wave;
    wavetext.anchor.setTo(0.5, 0.5);

    //wavetext.visible=true;
    //game.time.events.add(TIMER_OWP, function(){wavetext.alpha=0;})
    game.add.tween(wavetext).to( { alpha: 1 }, 1600, Phaser.Easing.Linear.None, true);
    game.add.tween(wavetext).to( { y: GAME_STAGE_HEIGHT/2 }, 1600, Phaser.Easing.Linear.None, true);
    wavetext.alpha=1;
    wavetext.y=GAME_STAGE_HEIGHT/2;
    game.add.tween(wavetext).to( { alpha: 0 }, 1600, Phaser.Easing.Linear.None, true, 2000);
    game.add.tween(wavetext).to( { y: GAME_STAGE_HEIGHT }, 1600, Phaser.Easing.Linear.None, true, 2000);
    if(wave==lastwave){
        soundmusica.stop();
        soundmusica=game.add.audio('finalwavesnd');
        soundmusica.play();
    }
}
function createTypist(){
    let x = game.world.centerX;
    let y = game.world.height - GAME_HUD_Y;
    typist = game.add.sprite(x, y, 'typist');
    typist.anchor.setTo(0.5, 0.5);
    typist.scale.setTo(0.5, 0.5);
    //createKeyControls();
    game.physics.arcade.enable(typist);
    typist.body.collideWorldBounds = true;
}
function typisthit(){
    typist.kill();
    displayBlast(typist);
    game.time.events.add(1500, function(){game.state.start('end')});
}

function getKeyboardInput(e) {
    let hit=false;
    if((e.key>='a' && e.key<='z')){
        totalshots++;
    }
    if(['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'].includes(e.key)){
        totalshots++;
    }
    //por alguna razon shift y entrer estan entre A y Z....

    if (active==-1){
        owpArry.forEach(function(v,i,array){
            if(owpArry[i].shielded){
            } else {
                if (owpArry[i].text.text[0]==e.key){

                    active=i;
                    processtype(active);
                    hit=true;
                }
            }
        });
    } else {
        if(owpArry[active].text.text[0]==e.key){
            processtype(active);
            hit=true;
        }
    }
    if(hit){
        hits++;
        if(level==3){
            charge++;
            updatechargehud();
        }
    }
    if(e.key==' ' && level==3 && charge>=100){
        ultimate();
    }

}
function processtype(index){
    fireLasers();
    owpArry[index].text.text=owpArry[index].text.text.substring(1);
    owpArry[index].setactiveTextColor();
    if(owpArry[index].text.text==""){
        displayBlast(owpArry[index].sprite, owpArry[index].sprite.scale.x)
        owpArry[index].sprite.destroy();
        owpArry[index].text.destroy();
        owpArry.splice(index, 1);
        active=-1;
        wavekills++;
    }
}

function displayBlast(ship, scale) {
    let blast = blasts.getFirstExists(false);
    let x = ship.body.center.x;
    let y = ship.body.center.y;
    blast.reset(x, y);
    if (scale < 1){
        blast.play('blast', 70, false, true);
    }
    else if (scale > 1){
        blast.play('blast', 15, false, true);
    }
    else{
        blast.play('blast', 30, false, true);
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
function resetMember(item){
    item.kill();
}
function createLasers(number) {
    let soundLaser;
    lasers = game.add.group();
    lasers.enableBody = true;
    lasers.createMultiple(number, 'laser');
    //cuando salga del mundo, reset member
    lasers.callAll('events.onOutOfBounds.add','events.onOutOfBounds', resetMember);
    lasers.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    lasers.setAll('checkWorldBounds', true);
}
function fireLasers() {
    let xl = typist.x; //salida laser R
    let yl = typist.y - LASERS_OFFSET_Y;//altura salida lasers
    let vl = LASERS_VELOCITY;//velocidad real del laser, como va hacia arriba va de coordenada alta a baja
    let laser = shootLaser(xl, yl, vl);
    if (laser) soundLaser.play();
}
function shootLaser(x, y, vl) {
    let shot = lasers.getFirstExists(false);
    if (shot) {
        shot.reset(x, y);
        //shot.body.velocity.y = vl;
        game.physics.arcade.moveToObject(shot, owpArry[active].sprite, vl);
        if(active>-1){
            shot.rotation=game.physics.arcade.angleBetween(shot, owpArry[active].sprite)+Math.PI/2;
        }
    }
    return shot;
}


// Entry point
window.onload = startGame;

function startGame() {
    game.state.add('start', startState);
    game.state.add('about', aboutState);
    game.state.add('end', endState);
    game.state.add('level1', level1State);
    game.state.add('level2', level2State);
    game.state.add('level3', level3State);
    game.state.add('level3pre', preState);

    //game.state.start('start');
    game.state.start('start');
}
let endState = {
    preload: preloadEnd,
    create: createEnd
};


function preloadEnd(){
    game.load.image('restartButton','assets/imgs/exit.png');
    game.load.audio('gamewin','assets/snds/gamewin.mp3');
    game.load.audio('gameover','assets/snds/gameover.mp3');
}
function createEnd(){
    soundmusica.stop();
    if(won){
        soundmusica=game.add.audio('gamewin');
    } else {
        soundmusica=game.add.audio('gameover');
    }
    soundmusica.loop=false;
    soundmusica.play();
    let accuracy;
    if(totalshots==0){
        accuracy=0;
    } else {
        accuracy=Math.floor((hits/totalshots)*100);
    }
    endText = game.add.text(110,2,
        '\nHITS\n'+ hits +'\n\nMISSES\n' + (totalshots-hits)+'\n\nACCURACY\n' + accuracy+'%', // text
        {fontSize: '50px', fill: '#1c87c9'});

        restartButton = game.add.button(game.world.width*0.75, game.world.height*0.95, 'restartButton',startScreen)
        restartButton.anchor.setTo(0.25, 0.25);
        restartButton.scale.setTo(0.15, 0.15);
}
let aboutState = {
    preload: preloadAbout,
    create: createAbout,
    update: updateAbout
};

let aboutText;

function preloadAbout(){
    game.load.image('returnButton','assets/imgs/exit.png');
    game.load.image('aboutText','assets/imgs/about_text.png');
    game.load.image('fondoEspacioMov','assets/imgs/fondoEspacioMov.png');
}
function createAbout(){
    soundmusica.stop();
    let w = game.world.width;
    let h = game.world.height;
    fondoEspacioMov = game.add.tileSprite(0, 0, w, h, 'fondoEspacioMov');

    aboutText = game.add.sprite(0, 0, 'aboutText');
    aboutText.anchor.setTo(0, 0);
    aboutText.scale.setTo(0.39, 0.409);

    returnButton = game.add.button(game.world.width*0.75, game.world.height*0.95, 'returnButton',startScreen)
    returnButton.anchor.setTo(0.25, 0.25);
    returnButton.scale.setTo(0.15, 0.15);
}
function updateAbout(){
    fondoEspacioMov.tilePosition.x += 1;
}

function startScreen() {
    game.state.start('start');
}
