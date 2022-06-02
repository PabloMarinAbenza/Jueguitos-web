class Weapon {
    constructor(c2d,filename,l,t) {
        this.canvas2d = c2d; this.image = new Image();
        this.image.myparent = this; this.image.src = filename;
        this.image.onload = function () {
            let m = this.myparent;
            m.canvas2d.drawImage(this,l,t);
            m.width = this.naturalWidth;
        };
        this.left = l;
        this.top = t;
        this.width;
    };
    clear() {
        let l = this.left, t = this.top;
        let w = this.image.naturalWidth;
        let h = this.image.naturalHeight;
        this.canvas2d.clearRect(l,t,w,h);
    };
    move(n) {
        this.left += n;
        let i = this.image;
        let l = this.left;
        let t = this.top; this.canvas2d.drawImage(i,l,t);
    };
};

let colors = ["cyan","green","gray","blue"];
let cIndex = 0;

let clash = {shield:undefined, mjolnir:undefined};
clash.timer = undefined;

clash.changeBackgroungColor = function () {
    const LEAP = 7;
    const LONG_PERIOD = 20;
    const SHORT_PERIOD = 1;
    let period;
    let sh = clash.shield, mj = clash.mjolnir;
    if (sh.left + 2 * sh.width > mj.left)
        period = SHORT_PERIOD;
    else
        period = LONG_PERIOD;
    if (sh.left % period === period - 1) {
        cIndex = (cIndex + LEAP) % colors.length;
        let bg = document.getElementById("battlefield");
        bg.style.backgroundColor = colors[cIndex];
    }
};

clash.advanceWeapons = function () {
    const SHIELD_MOVE = 1;
    const MJOLNIR_MOVE = -2;
    clash.shield.clear();
    clash.mjolnir.clear();
    clash.shield.move(SHIELD_MOVE);
    clash.mjolnir.move(MJOLNIR_MOVE);
    let sh = clash.shield, mj = clash.mjolnir;
    if (sh.left + sh.width / 2 > mj.left)
        clearInterval(clash.timer);
};

clash.advancing = false;
clash.animate = function ()
{ if (clash.advancing)
    clash.advanceWeapons();
    clash.changeBackgroungColor();
};

clash.initWeapons = function () {
    clash.cv = document.getElementById("scene");
    let ctx = clash.cv.getContext("2d");
    let sh = "images/CaptainAmericaShield.png";
    clash.shield = new Weapon(ctx,sh,0,260);
    let mj = "images/ThorMjolnir.png";
    clash.mjolnir = new Weapon(ctx,mj,651,250);
};

clash.randomArrayIndex = function (colors) {
    let randomInt  = random(0, colors.length)
    initBackground();
};

function initBackground() {
    for (let i = 0 ; i < colors.length ; i += 3) {
        colors.splice(i,0,"light"+colors[i]);
        colors.splice(i+2,0,"dark"+colors[i+1]);
    } // colors === ["lightcyan","cyan","darkcyan","lightgreen","green","darkgreen"...
    let decIndex = Math.random() * colors.length;
    cIndex = Math.floor(decIndex);
    let bg=document.getElementById("battlefield");
    bg.style.backgroundColor = colors[cIndex];
};

function entryPoint() {
    initBackground();
    clash.initWeapons();
    clash.mouseOverOutCanvas();
    const T = 1000 / 50; // 20 ms clash.timer = setInterval(clash.animate,T);
};
clash.mouseOverOutCanvas = function ()
{
    clash.cv.onmouseover = function ()
    {
        clash.advancing = true;
    };
    clash.cv.addEventListener("mouseout", function(){ clash.advancing = false;});
};


// Entry point
window.onload = entryPoint;
