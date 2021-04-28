export default class User {
    constructor(key, nick, status,me) {
        this.key = key
        this.nick = nick
        this.status = status
        this.me = me
    }
    create() {

        let div = document.createElement("div")
        div.className = "playerNick"
        div.id = this.key + "player"

        if (this.key == this.me) {
            div.classList.add("me")
        }

        if (this.status == 4) {
            div.style.backgroundColor = this.key
        }
        else if (this.status == 1) {
            div.style.backgroundColor = this.key
        }
        else {
            div.style.backgroundColor = "grey"
        }
        div.innerText = this.nick
        return div
    }
  
}