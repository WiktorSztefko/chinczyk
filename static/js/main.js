
import Game from "/js/GameKlient.js"
let game = new Game()
function init() {
    let button = document.getElementById("loginButton")
    button.addEventListener("click", () => {
        game.sendLogin()
    })
    console.log("init")
}

document.body.addEventListener("load", init())





