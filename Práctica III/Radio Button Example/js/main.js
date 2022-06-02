let endScreen;
let textInGame;
let buttonInGame;

function start() {
    let initialScreen = document.getElementById("initialScreen");
    textInGame = document.getElementById("texto");
    buttonInGame = document.getElementById("boton");
    endScreen = document.getElementById("endScreen");
    initialScreen.style.display = "none";
    playGame();
}

function playGame() {
    // Get the value of the radio button checked in the initial screen
    let radioButtons = document.getElementsByName("level");
    let choice, msg;
    for (const button of radioButtons) {
        if (button.checked) {
            choice = parseInt(button.value);
            break;
        }
    }
    // Set msg according to the level user chose
    switch (choice) {
        case 1:
            msg = "at the FIRST level.";
            break;
        case 2:
            msg = "at the SECOND level.";
            break;
        case 3:
            msg = "at the THIRD level.";;
            break;
        case 4:
            msg = "at the FOURTH level.";;
            break;
        default:
            // This should never be executed
            msg = "at NONE."
            break;
    }
    // Add contents to Game Screen
    textInGame.innerHTML = "You're PLAYING this game " + msg;
    let img = document.createElement("img");
    let att = document.createAttribute("src");
    att.value = "imgs/stop.jpg";
    img.setAttributeNode(att);
    att = document.createAttribute("width");
    att.value = "150px";
    img.setAttributeNode(att);
    att = document.createAttribute("height");
    att.value = "150px";
    img.setAttributeNode(att);
    att = document.createAttribute("onclick");
    att.value = "endGame()";
    img.setAttributeNode(att);
    buttonInGame.appendChild(img);
}

function endGame() {
    // Show end screen after 3 seconds
    window.setTimeout(showEndScreen, 3000);
}

function showEndScreen() {
    // Hide Game Screen
    let gameScreen = document.getElementById("gameScreen");
    gameScreen.style.display = "none";
    // Add some contents to End Screen
    // We could have employed innerHTML also (as before)
    let msg = document.createTextNode("The game is OVER!!!!");
    endScreen.appendChild(msg);
    // Show End Screen
    endScreen.style.display = "inline-block";
}