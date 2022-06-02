class owp{
    constructor(x, y, spriteimg, v=90, text, textoffset=20) {
        this.sprite=game.add.sprite(x, y, spriteimg);
        this.sprite.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        //
        this.sprite.body.onWorldBounds=new Phaser.Signal();
        this.sprite.body.onWorldBounds.add(function(){this.sprite.angle=-(180/Math.PI)*(Math.atan2(this.sprite.body.velocity.x,this.sprite.body.velocity.y))}, this);
        //
        this.textoffset=textoffset;
        this.text = game.add.text(this.sprite.x, this.sprite.y+this.textoffset, text,{fontSize: '16px', fill: '#FFF'});
        this.text.anchor.setTo(0.5, 0.5);
        this.v=v;
        this.setangle();
        //
        this.sprite.body.bounce.set(1);
    }
    v;
    //img.body.velocity.y=12;
    setangle(){

        //obtener vector direccion al typist

        this.sprite.angle=(180/Math.PI)*game.physics.arcade.angleBetween(this.sprite, typist);
        game.physics.arcade.moveToObject(this.sprite, typist, this.v);

        //desviar
        let angulo=this.sprite.angle+Math.floor(Math.random() * (DESVIO_ANGULAR +DESVIO_ANGULAR + 1) -DESVIO_ANGULAR);
        game.physics.arcade.velocityFromAngle(angulo,this.v,this.sprite.body.velocity);
        this.sprite.angle=angulo-90;
    }
    work(){
    }
    updateText(){
        this.text.x=this.sprite.x;
        this.text.y=this.sprite.y+this.textoffset;
    }
    getPositionX(){
        return this.sprite.x;
    }
    getPositionY(){
        return this.sprite.y;
    }
    setPosition(x, y){
        this.sprite.x=x;
        this.sprite.y=y;
        this.text.x=x;
        this.text.y=y+this.textoffset;
    }
    setactiveTextColor(){
        this.text.addColor('#eba134',0);
        this.text.addColor('#34eb61',1);
    }
}
class fanowp extends owp{
//super
    constructor(x, y, spriteimg, v=90, text, textoffset=20){
        super(x,y,spriteimg,v,text,textoffset);
        this.sprite.scale.setTo(1.5,1.5);
    }
    work(){
        for (let i=0;i<10;i++){
            let tmptiny=new tinyowp(this.sprite.x,this.sprite.y,'ufo', speedwavejson+20, tinyword[Math.floor(Math.random()*25)],20,25+i*15);
            owpArry.push(tmptiny);//da igual que se repita, multidisparo la elimina
        }
    }
}
class repowp extends owp{
    constructor(x, y, spriteimg, v=90, text, textoffset=20){
        super(x,y,spriteimg,v,text,textoffset);
        this.sprite.scale.setTo(1.5,1.5);
    }
    work(){
        owpArry.push(new owp(this.sprite.x,this.sprite.y,'ufo', speedwavejson+10,normarray[normiterador++]));
    }
}
class tinyowp extends owp{
    constructor(x, y, spriteimg, v=90, text, textoffset, angulo=90){
        super(x,y,spriteimg,v,text);
        this.sprite.scale.setTo(0.4,0.4);
        this.text.scale.setTo(0.7,0.7);
        //this.setangle(v, angulo);
        game.physics.arcade.velocityFromAngle(angulo,v,this.sprite.body.velocity);
        this.sprite.angle=angulo-90;
    }
    work(){
    }
    setangle(){
    }
}
//lvl3
class shieldedowp extends owp{
    constructor(x, y, spriteimg, v=90, text, textoffset=20){
        super(x,y,spriteimg,v,text,textoffset);
        this.shielded=true;
    }
}
//let cosa=new owp();

/*
https://photonstorm.github.io/phaser3-docs/
https://phaser.io/
la propia libreria phaser.js
*/