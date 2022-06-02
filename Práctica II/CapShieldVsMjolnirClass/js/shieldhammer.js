class Weapon {
    constructor(x) {
        this.image = x;
        let s = this.image.style.left;
        this.left = parseInt(s.slice(0,-2));
        s = this.image.style.fontSize;
        this.width = parseInt(s.slice(0,-2));
    };
    move(n) {
        this.left += n;
        this.image.style.left = this.left + "px";
    };
};

class Clash{
    constructor(){
        this.shield = undefined;
        this.mjolnir = undefined;
    };
}

let colors = ["cyan","green","gray","blue"];
let cIndex = 0;

let clash = new Clash();
clash.timer = undefined;

clash.changeBackgroungColor = function()
{
    const LEAP = 7;
    const LONG_PERIOD = 20;
    const SHORT_PERIOD = 1;
    let period;
    let sh = shield, mj = mjolnir;
    if (sh.left + 2 * sh.width > mj.left)
        period = SHORT_PERIOD;
    else
        period = LONG_PERIOD;
    if (sh.left % period === period - 1)
    {
        cIndex = (cIndex + LEAP) % colors.length;
        let bg = document.getElementById("battlefield");
        bg.style.backgroundColor = colors[cIndex];
    }
};

clash.advanceWeapons = function()
{
    const SHIELD_MOVE = 1;
    const MJOLNIR_MOVE = -2;
    clash.shield.move(SHIELD_MOVE);
    clash.mjolnir.move(MJOLNIR_MOVE);
    let sh = shield, mj = mjolnir;
    if (sh.left + sh.width / 2 > mj.left)
        clearInterval(clash.timer);
};

clash.animate = function()
{
    clash.advanceWeapons();
    clash.changeBackgroungColor();
};

clash.initWeapons = function()
{
    let sh = document.getElementById("capshield");
    shield = new Weapon(sh);
    let mj = document.getElementById("mjolnir");
    mjolnir = new Weapon(mj);
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

function entryPoint()
{
    initBackground();

    clashObject = new Clash(); //No funciona? Desde luego, no se mueve
    clashObject.initWeapons();

    const T = 1000 / 50; // 20 ms
    clashObject.timer = setInterval(clashObject.animate,T);
};

// Entry point
window.onload = entryPoint;
