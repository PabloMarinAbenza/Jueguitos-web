const POS_TEXT_X= 325;
const POS_TEXT_Y= 250;

let endState = { //Esto estaba desde 0, así que todo lo escrito es nuevo
    preload: preloadEnd,
    create: createEnd,
    update: updateEnd
};

function preloadEnd(){
    game.load.image('craft', 'assets/imgs/craft.png');
}

function createEnd(){
    let textText1 = "Last score:";
    let textText2 = score;

    let styleText1 = {font: '35px Arial', fill: 'yellow'};
    let styleText2 = {font: '75px Arial', fill: 'orange'};

    game.add.text(POS_TEXT_X, POS_TEXT_Y, textText1, styleText1);
    game.add.text(POS_TEXT_X+20, POS_TEXT_Y+50, textText2, styleText2);

    craft = game.add.sprite(0,0, 'craft');
    craft.anchor.setTo(0.5, 0.5);
    craft.angle= 90;
    craft.scale.setTo(2,2);
    craft.x = craft.width;
    craft.y = craft.height
}

function updateEnd(){
    if(craft.angle == 90){
        if(craft.width+craft.x >= game.world.width){
            craft.angle = -180;
        }
        else{
            craft.x += 5;
        }
    }
    else if(craft.angle == -180){
        if(craft.height+craft.y >= game.world.height){
            craft.angle = 270;
        }
        else{
            craft.y += 5;
        }
    }
    else if(craft.angle == -90){
        if(craft.x-craft.width <= 0){
            craft.angle = 0;
        }
        else{
            craft.x -= 5;
        }
    }
    else if(craft.angle == 0){
        if(craft.y-craft.height <= 0){
            craft.angle = 90;
        }
        else{
            craft.y -= 5;
        }
    }
}