
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
    clash.shield.move(SHIELD_MOVE);
    clash.mjolnir.clear();
    clash.mjolnir.move(MJOLNIR_MOVE);
    let sh = clash.shield, mj = clash.mjolnir;
    if (sh.left + sh.width / 2 > mj.left){
        clearInterval(clash.timer);
    }
};

clash.advancing = false;
clash.animate = function () {
    if (clash.advancing)
        clash.advanceWeapons();
    clash.changeBackgroungColor();
};

function init() {
    let scene = document.getElementById("fillme");

    let paragraph = document.createElement("p");
    scene.appendChild(paragraph);

    let letters = document.createTextNode("A continuación, una lista numerada");
    paragraph.appendChild(letters);

    let style = document.createAttribute("style");
    style.value = "font-family: Arial; font-size: 16pt; color: blue;";
    paragraph.setAttributeNode(style);

    let lists = document.createElement("ol");
    paragraph.appendChild(lists);


    let list1 = document.createElement("li");
    lists.appendChild(list1);

    let list1text = document.createTextNode("Primer ítem");
    list1.appendChild(list1text);

    let list2 = document.createElement("li");
    lists.appendChild(list2);

    let list2text = document.createTextNode("Segundo ítem");
    list2.appendChild(list2text);
};

function entryPoint() {
    init();
};
clash.mouseOverOutCanvas = function () {
    clash.cv.onmouseover = function () {
        clash.advancing = true;
    };
    clash.cv.addEventListener("mouseout", function() {
        clash.advancing = false;
    });
};

// Entry point
window.onload = entryPoint;
