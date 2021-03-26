export default class Game {
    constructor(obj) {

    }

    whoIAm() {
        let me
        for (let key in this.obj.players) {
            me = key
        }
        return me
    }
    sendLogin() {
        let name = document.getElementById("loginInput").value
        //name= encodeURIComponent(name)
        console.log(name)

        if (name != "" || name.length <= 16) {

            this.postData('/login', { name: name })
                .then(data => {
                    console.log(data)
                    let promptElement = document.getElementById("prompt")
                    promptElement.remove()
                    this.init(data)
                });

        }
        else {
            alert("Podaj nick")
        }
    }


    init(obj) {
        this.id = obj.id
        this.started = obj.started == 1
        this.obj = obj
        this.me = this.whoIAm()
        this.generateHeader()
        this.interval = ""
        this.startRequesting()
    }

    async postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }

    generateHeader() {

        let header = document.createElement("div")
        header.className = "header"

        if (!this.started) {
            let switchButton = document.createElement("div")
            switchButton.classList.add("switchButton")

            switchButton.addEventListener("click", () => {

                let button = document.getElementsByClassName("switchButton")[0]

                this.postData('/changeState', { id: this.id, color: this.me })
                    .then(data => {
                        console.log(data)
                        this.update(data)
                    });

                if (this.obj.players[this.me].status == 0) {
                    button.classList.add("switchButtonOn")
                } else if (this.obj.players[this.me].status == 1) {
                    button.classList.remove("switchButtonOn")
                }
            })

            let dot = document.createElement("div")
            dot.className = "switchDot"
            switchButton.appendChild(dot)
            header.appendChild(switchButton)
        }

        for (let key in this.obj.players) {
            let div = document.createElement("div")
            div.className = "playerNick"
            div.id = key + "player"
            if (key == this.me) {
                div.classList.add("me")
            }
            div.style.backgroundColor = key
            div.innerText = this.obj.players[key].nick
            header.appendChild(div)
        }

        console.log(this.started)


        document.body.appendChild(header)

    }
    addUsers(data) {
        for (let key in data.players) {
            if (this.obj.players[key] == undefined) {

                let header = document.getElementsByClassName("header")[0]
                let div = document.createElement("div")
                div.className = "playerNick"
                div.id = key + "player"
                if (key == this.me) {
                    div.classList.add("me")
                }
                div.style.backgroundColor = key
                div.innerText = data.players[key].nick
                header.appendChild(div)
            }
        }
    }

    startRequesting() {
        this.interval = setInterval(() => {
            this.postData('/check', { id: this.id })
                .then(data => {
                    this.update(data)
                });
        }, 1000)
    }

    update(data) {

        if (JSON.stringify(data) != JSON.stringify(this.obj)) {
            console.log("inne")
            if (!this.started && data.started == 1) {
                let btn = document.getElementsByClassName("switchButton")[0]
                btn.remove()
            }
            this.addUsers(data)

            this.obj = data
            this.started = this.obj.started == 1

            if (this.started) {
                console.log("started")
            } else {
                console.log("not started")
            }
        }
        else {
            console.log("takie same")
        }
    }
}

