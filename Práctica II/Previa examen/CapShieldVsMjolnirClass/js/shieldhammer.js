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
        this.shield = new Weapon(document.getElementById("capshield"));
        this.mjolnir = new Weapon(document.getElementById("mjolnir"));
        this.timer = undefined;
    }

    changeBackgroungColor() {
        const LEAP = 7;
        const LONG_PERIOD = 20;
        const SHORT_PERIOD = 1;
        let period;
        let sh = this.shield, mj = this.mjolnir;
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
    
    advanceWeapons() {
        const SHIELD_MOVE = 1;
        const MJOLNIR_MOVE = -2;
        this.shield.move(SHIELD_MOVE);
        this.mjolnir.move(MJOLNIR_MOVE);
        let sh = this.shield, mj = this.mjolnir;
        if (sh.left + sh.width / 2 > mj.left) clearInterval(this.timer);
    };
    
    animate() {
        clash.advanceWeapons();
        clash.changeBackgroungColor();
    };
    

}

let colors = ["cyan","green","gray","blue"];
let cIndex = 0;
let clash = new Clash();

function initBackground() {
    for (let i = 0 ; i < colors.length ; i += 3) {
        colors.splice(i,0,"light"+colors[i]);
        colors.splice(i+2,0,"dark"+colors[i+1]);
    } // colors === ["lightcyan","cyan","darkcyan","lightgreen","green","darkgreen"...
    //let decIndex = Math.random() * colors.length;
    //cIndex = Math.floor(decIndex);
    let bg=document.getElementById("battlefield");
    bg.style.backgroundColor = randomArrayIndex(colors);
};

function entryPoint() {
    initBackground();
    const T = 1000 / 50; // 20 ms
    clash.timer = setInterval(clash.animate,T);
};

function randomArrayIndex(array){
    let rndIndex = Math.random() * array.length;
    return array[rndIndex];
}

// Entry point
window.onload = entryPoint;
