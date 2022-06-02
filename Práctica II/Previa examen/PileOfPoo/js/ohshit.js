let myGame = {};
let drawingX = 0;
let drawingY = 0;

// Entry point
window.onload = function () {
    myGame.init();
};

myGame.init = function () {
    // Hide all game layers and display the start screen
    document.getElementById("gamestartscreen").style.display = 'inline';
    // Get handler for game canvas and context
    myGame.canvas = document.getElementById("gamestartscreen");
    myGame.context = myGame.canvas.getContext("2d");

    myGame.context.moveTo(drawingX, drawingY);
    myGame.context.lineWidth = 5;
    myGame.context.lineCap = "round";
    myGame.context.lineJoin = "round";
    myGame.context.strokeStyle = "#523129";
    myGame.context.stroke();

    myGame.context.fillStyle = "#79473B";

    roundRect(myGame.context, drawingX + 180, drawingY + 400, 400, 100, {tl: 50, tr: 50, bl: 50, br: 50}, true);
    roundRect(myGame.context, drawingX + 230, drawingY + 300, 300, 100, {tl: 50, tr: 50, bl: 50, br: 50}, true);
    roundRect(myGame.context, drawingX + 280, drawingY + 200, 200, 100, {tl: 50, tr: 50, bl: 50, br: 50}, true);

    myGame.context.beginPath();
    myGame.context.moveTo(drawingX + 420, drawingY + 200);
    //myGame.context.lineTo(drawingX + 330, drawingY + 100);
    myGame.context.quadraticCurveTo(drawingX + 480, drawingY + 200, drawingX + 360, drawingY + 100);
    myGame.context.quadraticCurveTo(drawingX + 380, drawingY + 200, drawingX + 335, drawingY + 200);
    //myGame.context.lineTo(drawingX + 100, drawingY + 200 - 50);
    myGame.context.closePath();
    myGame.context.fill();
    myGame.context.stroke();

    
};

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  
  }

/*

let bg=document.getElementById("battlefield");
let div1 = document.createElement("div");
bg.appendChild(div1);

let letterO = document.createTextNode("O");
div1.appendChild(letterO);

let att = document.createAttribute("id");
att.value = "capshield";
div1.setAttributeNode(att);*/