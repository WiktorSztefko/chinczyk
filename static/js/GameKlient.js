import User from "./User.js"
import Pawn from "./Pawn.js"
import { plansza } from "./pozycje.js"


export default class Game {
    constructor(obj) {
        this.plansza = plansza
        // console.log(this.plansza)
    }

    whoIAm() {
        let me
        for (let key in this.obj.players) {
            me = key
        }
        return me
    }


    init(obj) {
        this.id = obj.id
        this.started = obj.started == 1
        this.obj = obj
        this.startHelper = true
        this.me = this.whoIAm()
        this.generateHeader()
        this.interval = ""
        this.startRequesting()
        this.currentTime = 30
        this.oneOrMorePawnsOnBoard = false
        this.wylosowana = ""
        this.divs = []
        this.myTurn = false
        console.log(this.plansza)
    }


    sendLogin() {
        let name = document.getElementById("loginInput").value
        //console.log(name)

        if (name != "" && name.length <= 16) {

            this.postData('/login', { name: name })
                .then(data => {
                    //  console.log(data)
                    let promptElement = document.getElementById("prompt")
                    promptElement.remove()
                    this.init(data)
                });

        }
        else {
            alert("Podaj nick")
        }
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
        header.id = "header"

        if (!this.started) {
            let switchButton = document.createElement("div")
            switchButton.classList.add("switchButton")

            switchButton.addEventListener("click", () => {

                let button = document.getElementsByClassName("switchButton")[0]

                this.postData('/changeState', { id: this.id, color: this.me })
                    .then(data => {
                        //console.log(data)
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
            let user = new User(key, this.obj.players[key].nick, this.obj.players[key].status, this.me)
            let div = user.create()
            header.appendChild(div)
        }

        document.body.appendChild(header)
    }


    addUsers(data) {

        for (let key in data.players) {
            if (this.obj.players[key] == undefined) {
                let header = document.getElementById("header")
                let user = new User(key, data.players[key].nick, data.players[key].status, this.me)
                let div = user.create()
                header.appendChild(div)
            }
        }
    }


    startRequesting() {
        this.interval = setInterval(() => {
            //console.log("request")
            this.postData('/check', { id: this.id })
                .then(data => {
                    this.update(data)
                });
            if (this.obj.players[this.me].status == 3) {
                this.currentTime--
                //console.log(this.currentTime)
                if (this.currentTime == 0) {
                    this.changeTure()
                    this.currentTime = 30
                }
            }

        }, 1000)
    }


    update(data) {

        if (JSON.stringify(data) != JSON.stringify(this.obj)) {
            // console.log("inne")
            if (!this.started && data.started == 1) {
                let btn = document.getElementsByClassName("switchButton")[0]
                btn.remove()
                this.generateContainer()


            }

            this.addUsers(data)
            this.obj = data
            this.color()
            this.pawnsPosition()


            if (this.obj.players[this.me].status == 3) {
                // console.log("Moj status" + this.obj.players[this.me].status)
                let bt = document.getElementById("button")
                if (bt == null) {
                    this.generateKostka()

                }
            }


            this.started = this.obj.started == 1
            if (this.started) {
                // console.log("started")

            } else {
                // console.log("not started")
            }


            if (document.getElementById("green3") != null) {

                //this.divs=[]
                document.getElementById("red0").position = this.obj.pawns.red[0]
                if (document.getElementById(`red0`).position > 39) {
                    document.getElementById(`red0`).status = "inHome"
                }
                document.getElementById("red1").position = this.obj.pawns.red[1]
                if (document.getElementById(`red1`).position > 39) {
                    document.getElementById(`red1`).status = "inHome"
                }
                document.getElementById("red2").position = this.obj.pawns.red[2]
                if (document.getElementById(`red2`).position > 39) {
                    document.getElementById(`red2`).status = "inHome"
                }
                document.getElementById("red3").position = this.obj.pawns.red[3]
                if (document.getElementById(`red3`).position > 39) {
                    document.getElementById(`red3`).status = "inHome"
                }

                document.getElementById(`blue0`).position = this.obj.pawns.blue[0]
                if (document.getElementById(`blue0`).position > 39) {
                    document.getElementById(`blue0`).status = "inHome"
                }
                document.getElementById(`blue1`).position = this.obj.pawns.blue[1]
                if (document.getElementById(`blue1`).position > 39) {
                    document.getElementById(`blue1`).status = "inHome"
                }
                document.getElementById(`blue2`).position = this.obj.pawns.blue[2]
                if (document.getElementById(`blue2`).position > 39) {
                    document.getElementById(`blue2`).status = "inHome"
                }
                document.getElementById(`blue3`).position = this.obj.pawns.blue[3]
                if (document.getElementById(`blue3`).position > 39) {
                    document.getElementById(`blue3`).status = "inHome"
                }

                if (this.obj.pawns.yellow) {
                    document.getElementById("yellow0").position = this.obj.pawns.yellow[0]
                    if (document.getElementById(`yellow0`).position > 39) {
                        document.getElementById(`yellow0`).status = "inHome"
                    }
                    document.getElementById("yellow1").position = this.obj.pawns.yellow[1]
                    if (document.getElementById(`yellow1`).position > 39) {
                        document.getElementById(`yellow1`).status = "inHome"
                    }
                    document.getElementById("yellow2").position = this.obj.pawns.yellow[2]
                    if (document.getElementById(`yellow2`).position > 39) {
                        document.getElementById(`yellow2`).status = "inHome"
                    }
                    document.getElementById("yellow3").position = this.obj.pawns.yellow[3]
                    if (document.getElementById(`yellow3`).position > 39) {
                        document.getElementById(`yellow3`).status = "inHome"
                    }
                }

                if (this.obj.pawns.green) {
                    document.getElementById("green0").position = this.obj.pawns.green[0]
                    if (document.getElementById(`green0`).position > 39) {
                        document.getElementById(`green0`).status = "inHome"
                    }
                    document.getElementById("green1").position = this.obj.pawns.green[1]
                    if (document.getElementById(`green1`).position > 39) {
                        document.getElementById(`green1`).status = "inHome"
                    }
                    document.getElementById("green2").position = this.obj.pawns.green[2]
                    if (document.getElementById(`green2`).position > 39) {
                        document.getElementById(`green2`).status = "inHome"
                    }
                    document.getElementById("green3").position = this.obj.pawns.green[3]
                    if (document.getElementById(`green3`).position > 39) {
                        document.getElementById(`green3`).status = "inHome"
                    }
                }


            }


        }
        else if (this.startHelper && this.me == "green") {
            this.generateContainer()
            this.startHelper = !this.startHelper
            this.color()
        }
        else {
            //console.log("takie same")
            //console.log(data)
        }
    }
    pawnsPosition() {
        //console.log(this.obj.pawns)
        if (this.started) {

            for (let key in this.obj.pawns) {

                for (let i = 0; i < this.obj.pawns[key].length; i++) {

                    if (this.obj.pawns[key][i] >= 0) {
                        let pawn = document.getElementById(key + i)
                        pawn.style.top = this.plansza[this.obj.pawns[key][i]].y + "px"
                        pawn.style.left = this.plansza[this.obj.pawns[key][i]].x + "px"
                    }
                }
            }
        }
    }
    generateContainer() {

        let container = document.createElement("div")
        container.setAttribute("id", "container")

        let poleRzucania = document.createElement("div")
        poleRzucania.setAttribute("id", "poleRzucania")
        container.appendChild(poleRzucania)

        let board = document.createElement("div")
        board.setAttribute("id", "board")
        board.style.background = "url(../img/board.png)"


        container.appendChild(board)
        document.body.appendChild(container)
        this.generatePawn()
    }

    generatePawn() {

        this.divs = []
        let x = 0
        let y = 0
        let board = document.getElementById("board")

        let pawn = new Pawn("red", 51 + x, 51 + y, "red0")
        let div = pawn.create()
        this.divs.push(div)

        pawn = new Pawn("red", 120 + x, 51 + y, "red1")
        div = pawn.create()
        this.divs.push(div)

        pawn = new Pawn("red", 51 + x, 120 + y, "red2")
        div = pawn.create()
        this.divs.push(div)

        pawn = new Pawn("red", 120 + x, 120 + y, "red3")
        div = pawn.create()
        this.divs.push(div)

        x = 625

        pawn = new Pawn("blue", 51 + x, 51 + y, "blue0")
        div = pawn.create()
        this.divs.push(div)

        pawn = new Pawn("blue", 120 + x, 51 + y, "blue1")
        div = pawn.create()
        this.divs.push(div)

        pawn = new Pawn("blue", 51 + x, 120 + y, "blue2")
        div = pawn.create()
        this.divs.push(div)

        pawn = new Pawn("blue", 120 + x, 120 + y, "blue3")
        div = pawn.create()
        this.divs.push(div)

        x = 0
        y = 625

        pawn = new Pawn("yellow", 51 + x, 51 + y, "yellow0")
        div = pawn.create()
        this.divs.push(div)

        pawn = new Pawn("yellow", 120 + x, 51 + y, "yellow1")
        div = pawn.create()
        this.divs.push(div)

        pawn = new Pawn("yellow", 51 + x, 120 + y, "yellow2")
        div = pawn.create()
        this.divs.push(div)

        pawn = new Pawn("yellow", 120 + x, 120 + y, "yellow3")
        div = pawn.create()
        this.divs.push(div)

        x = 625

        pawn = new Pawn("green", 51 + x, 51 + y, "green0")
        div = pawn.create()
        this.divs.push(div)

        pawn = new Pawn("green", 120 + x, 51 + y, "green1")
        div = pawn.create()
        this.divs.push(div)

        pawn = new Pawn("green", 51 + x, 120 + y, "green2")
        div = pawn.create()
        this.divs.push(div)

        pawn = new Pawn("green", 120 + x, 120 + y, "green3")
        div = pawn.create()
        this.divs.push(div)

        for (let el of this.divs) {
            let div = el
            if (div.style.backgroundColor == this.me) {

                div.addEventListener("mouseout", () => {
                    if (this.myTurn == true) {
                        if (div.status == "inGame") {
                            div.style.cursor = "default"
                            if (document.getElementById("pink")) {
                                let pink = document.getElementById("pink")
                                pink.remove()
                            }
                        }
                    }
                })

                div.addEventListener("mouseover", () => {
                    if (this.myTurn == true) {
                        if (div.status == "inGame") {
                            div.style.cursor = "pointer"
                            let maybeNewPosition = div.position + this.wylosowana

                            if (maybeNewPosition > 39) {
                                maybeNewPosition = maybeNewPosition - 39 - 1 //-1 bo tablica od 0
                            }

                            let pink = document.createElement("div")
                            pink.id = "pink"
                            pink.style.width = 20 + "px"
                            pink.style.height = 20 + "px"
                            pink.style.backgroundColor = "pink"
                            pink.style.zIndex = 20
                            pink.style.borderRadius = 50 + "%"
                            pink.style.position = "absolute"
                            pink.style.transform = "translate(-10px, -10px)"
                            pink.style.top = this.plansza[maybeNewPosition].y + "px"
                            pink.style.left = this.plansza[maybeNewPosition].x + "px"
                            board.appendChild(pink)
                        }
                    }

                })

                div.addEventListener("click", () => {

                    if (this.myTurn == true) {
                        console.log(div.status)
                        if (div.status == "inGame") {
                            this.move(div)
                            // console.log("game")
                        }
                        else if (div.status == "inHome" && (this.wylosowana == 1 || this.wylosowana == 6)) {
                            // console.log("home")
                            this.move(div)
                        }
                    }
                })
            }
            board.appendChild(div)
        }
    }


    color() {

        for (let key in this.obj.players) {
            if (this.obj.players[key].status >= 1) {
                let user = document.getElementById(key + "player")
                user.style.background = key
            }
            else if (this.obj.players[key].status == 0) {
                let user = document.getElementById(key + "player")
                user.style.background = "grey"
            }
        }
    }
    move(div) {

        let index = div.id
        index = index.substr(-1, 1)

        //console.log(this.divs)
        // for (let el of this.divs) {
        //     console.log(el.position)
        // }
        let newField
        let newHomePosition

        if (div.status == "inHome") {
            if (this.me == "blue") {
                //     div.style.top = this.plansza[10].y + "px"
                //     div.style.left = this.plansza[10].x + "px"
                //     this.obj.pawns[this.me][index] = 10
                //    // this.oneOrMorePawnsOnBoard = true
                //     //this.plansza[10].color=div.id
                //     div.status = "inGame"
                //     div.position = 10
                newField = 10
                // console.log("blue")
            }
            else if (this.me == "green") {
                // div.style.top = this.plansza[20].y + "px"
                // div.style.left = this.plansza[20].x + "px"
                // this.obj.pawns[this.me][index] = 20
                // //this.oneOrMorePawnsOnBoard = true
                // // this.plansza[20].color=div.id
                // div.status = "inGame"
                // div.position = 20
                newField = 20
                //console.log("green")
            }
            else if (this.me == "yellow") {
                //     div.style.top = this.plansza[30].y + "px"
                //     div.style.left = this.plansza[30].x + "px"
                //     this.obj.pawns[this.me][index] = 30
                //    // this.oneOrMorePawnsOnBoard = true
                //     // this.plansza[30].color=div.id
                //     div.status = "inGame"
                // div.position = 30
                newField = 30
            }
            else if (this.me == "red") {
                // div.style.top = this.plansza[0].y + "px"
                // div.style.left = this.plansza[0].x + "px"
                // this.obj.pawns[this.me][index] = 0
                // //this.oneOrMorePawnsOnBoard = true
                // //this.plansza[0].color=div.id
                // div.status = "inGame"
                // div.position = 0
                newField = 0
            }
            for (let key in this.obj.pawns) {
                if (key != this.me) {
                    //console.log("przeciwnik" + this.obj.pawns[key])
                    for (let pos of this.obj.pawns[key]) {
                        // console.log(pos)
                        if (pos == newField) {
                            console.log("zbijane bedzie")
                            for (let pawn of this.divs) {
                                //console.log(pawn.position)
                                if (pawn.position == pos) {
                                    console.log("----------zbijany------------")
                                    console.log(pawn)//to jest pion do zbicia


                                    if (key == "blue") {
                                        if (this.obj.pawns[key].includes(44) == false) {
                                            newHomePosition = 44
                                        }
                                        else if (this.obj.pawns[key].includes(45) == false) {
                                            newHomePosition = 45
                                        }
                                        else if (this.obj.pawns[key].includes(46) == false) {
                                            newHomePosition = 46
                                        }
                                        else if (!this.obj.pawns[key].includes(47) == false) {
                                            newHomePosition = 47
                                        }
                                    }
                                    else if (key == "green") {
                                        if (this.obj.pawns[key].includes(52) == false) {
                                            newHomePosition = 52
                                        }
                                        else if (this.obj.pawns[key].includes(53) == false) {
                                            newHomePosition = 53
                                        }
                                        else if (this.obj.pawns[key].includes(54) == false) {
                                            newHomePosition = 54
                                        }
                                        else if (this.obj.pawns[key].includes(55) == false) {
                                            newHomePosition = 55
                                        }
                                    }
                                    else if (key == "red") {
                                        if (this.obj.pawns[key].includes(40) == false) {
                                            newHomePosition = 40
                                        }
                                        else if (this.obj.pawns[key].includes(41) == false) {
                                            newHomePosition = 41
                                        }
                                        else if (this.obj.pawns[key].includes(42) == false) {
                                            newHomePosition = 42
                                        }
                                        else if (this.obj.pawns[key].includes(43) == false) {
                                            newHomePosition = 43
                                        }
                                    }
                                    else if (key == "yellow") {
                                        if (this.obj.pawns[key].includes(48) == false) {
                                            newHomePosition = 48
                                        }
                                        else if (this.obj.pawns[key].includes(49) == false) {
                                            newHomePosition = 49
                                        }
                                        else if (this.obj.pawns[key].includes(50) == false) {
                                            newHomePosition = 50
                                        }
                                        else if (this.obj.pawns[key].includes(51) == false) {
                                            newHomePosition = 51
                                        }
                                    }


                                    let id = pawn.id.substr(-1)
                                    //console.log(this.plansza)
                                    console.log(newHomePosition)
                                    // console.log(this.plansza[newHomePosition])
                                    pawn.style.top = this.plansza[newHomePosition].y + "px"
                                    pawn.style.left = this.plansza[newHomePosition].x + "px"
                                    // console.log(pawn.status+" stary")
                                    pawn.status = "inHome"
                                    //console.log(pawn.status+" stary")
                                    //pawn.position = newHomePosition 
                                    //console.log(pawn.position)
                                    this.obj.pawns[key][id] = newHomePosition
                                    newHomePosition = ""
                                    console.log("------------zbijany----------")
                                }
                            }
                        }
                    }
                }
            }
            div.style.top = this.plansza[newField].y + "px"
            div.style.left = this.plansza[newField].x + "px"
            this.obj.pawns[this.me][index] = newField
            // this.oneOrMorePawnsOnBoard = true
            // this.plansza[30].color=div.id
            div.status = "inGame"
            div.position = newField
            // newField=30
        }

        else if (div.status == "inGame") {
            //console.log(div.position)
            //console.log(this.wylosowana)

            let newField = div.position + this.wylosowana
            let newHomePosition

            if (newField > 39) {
                newField = newField - 39 - 1 //-1 bo tablica od 0
            }


            for (let key in this.obj.pawns) {
                if (key != this.me) {
                    //console.log("przeciwnik" + this.obj.pawns[key])
                    for (let pos of this.obj.pawns[key]) {
                        // console.log(pos)
                        if (pos == newField) {
                            console.log("zbijane bedzie")
                            for (let pawn of this.divs) {
                                //console.log(pawn.position)
                                if (pawn.position == pos) {
                                    console.log("----------zbijany------------")
                                    console.log(pawn)//to jest pion do zbicia


                                    if (key == "blue") {
                                        if (this.obj.pawns[key].includes(44) == false) {
                                            newHomePosition = 44
                                        }
                                        else if (this.obj.pawns[key].includes(45) == false) {
                                            newHomePosition = 45
                                        }
                                        else if (this.obj.pawns[key].includes(46) == false) {
                                            newHomePosition = 46
                                        }
                                        else if (!this.obj.pawns[key].includes(47) == false) {
                                            newHomePosition = 47
                                        }
                                    }
                                    else if (key == "green") {
                                        if (this.obj.pawns[key].includes(52) == false) {
                                            newHomePosition = 52
                                        }
                                        else if (this.obj.pawns[key].includes(53) == false) {
                                            newHomePosition = 53
                                        }
                                        else if (this.obj.pawns[key].includes(54) == false) {
                                            newHomePosition = 54
                                        }
                                        else if (this.obj.pawns[key].includes(55) == false) {
                                            newHomePosition = 55
                                        }
                                    }
                                    else if (key == "red") {
                                        if (this.obj.pawns[key].includes(40) == false) {
                                            newHomePosition = 40
                                        }
                                        else if (this.obj.pawns[key].includes(41) == false) {
                                            newHomePosition = 41
                                        }
                                        else if (this.obj.pawns[key].includes(42) == false) {
                                            newHomePosition = 42
                                        }
                                        else if (this.obj.pawns[key].includes(43) == false) {
                                            newHomePosition = 43
                                        }
                                    }
                                    else if (key == "yellow") {
                                        if (this.obj.pawns[key].includes(48) == false) {
                                            newHomePosition = 48
                                        }
                                        else if (this.obj.pawns[key].includes(49) == false) {
                                            newHomePosition = 49
                                        }
                                        else if (this.obj.pawns[key].includes(50) == false) {
                                            newHomePosition = 50
                                        }
                                        else if (this.obj.pawns[key].includes(51) == false) {
                                            newHomePosition = 51
                                        }
                                    }


                                    let id = pawn.id.substr(-1)
                                    //console.log(this.plansza)
                                    console.log(newHomePosition)
                                    // console.log(this.plansza[newHomePosition])
                                    pawn.style.top = this.plansza[newHomePosition].y + "px"
                                    pawn.style.left = this.plansza[newHomePosition].x + "px"
                                    // console.log(pawn.status+" stary")
                                    pawn.status = "inHome"
                                    //console.log(pawn.status+" stary")
                                    //pawn.position = newHomePosition 
                                    //console.log(pawn.position)
                                    this.obj.pawns[key][id] = newHomePosition
                                    newHomePosition = ""
                                    console.log("------------zbijany----------")
                                }
                            }
                        }
                    }
                }
            }



            div.style.top = this.plansza[newField].y + "px"
            div.style.left = this.plansza[newField].x + "px"
            this.obj.pawns[this.me][index] = newField

            div.position = newField
        }


        this.postData('/changeStatus', { obj: this.obj })
            .then(data => {
                this.changeTure()

            });

    }


    generateKostka() {
        let button = document.createElement("button")
        button.setAttribute("id", "button")
        button.textContent = "rzuć kostką"

        let poleRzucania = document.getElementById("poleRzucania")

        button.addEventListener("click", () => {

            this.losujRuch()

        })
        poleRzucania.appendChild(button)
    }


    losujRuch() {
        let move = Math.floor(Math.random() * 6) + 1
        this.wylosowana = move

        let poleRzucania = document.getElementById("poleRzucania")
        let kostka = document.createElement("div")
        kostka.setAttribute("id", "kostka")

        let img = document.createElement("img")
        img.src = `../img/${move}.png`
        kostka.appendChild(img)

        if (document.getElementById("kostka") == null) {
            poleRzucania.appendChild(kostka)
        }
        else {
            document.getElementById("kostka").remove()
            poleRzucania.appendChild(kostka)
        }

        /////////////////////////////////////
        var synth = window.speechSynthesis;
        var voices = [];

        populateVoiceList();
        function populateVoiceList() {
            voices = synth.getVoices();
            //console.log(voices);
        }

        if (speechSynthesis.onvoiceschanged !== undefined)
            speechSynthesis.onvoiceschanged = populateVoiceList


        var u = new SpeechSynthesisUtterance();
        u.text = move;
        u.pitch = 1;
        u.rate = 1;
        u.voice = voices[19];
        synth.speak(u);

        //////////////////////////////////

        if (move == 1 || move == 6) {
            let bt = document.getElementById("button")
            bt.remove()
            this.myTurn = true
        } else if (document.getElementById(this.me + 0).status == "inGame" || document.getElementById(this.me + 1).status == "inGame" || document.getElementById(this.me + 2).status == "inGame" || document.getElementById(this.me + 3).status == "inGame") {
            this.wylosowana = move
            let bt = document.getElementById("button")
            this.myTurn = true
            bt.remove()
        }
        else {
            this.changeTure()
        }

    }

    changeTure() {
        //console.log("zmiana koljeki")
        this.currentTime = 30
        this.myTurn = false

        if (document.getElementById("pink")) {
            document.getElementById("pink").remove()
        }

        for (let key in this.obj.players) {
            this.obj.players[key].status = 2
        }

        if (this.me == "red") {
            this.obj.players['blue'].status = 3
        }
        else if (this.me == "blue") {
            if (this.obj.players['yellow'] != undefined) {
                this.obj.players['yellow'].status = 3
            }
            else {
                this.obj.players['red'].status = 3
            }
        }
        else if (this.me == "yellow") {
            if (this.obj.players['green'] != undefined) {
                this.obj.players['green'].status = 3
            }
            else {
                this.obj.players['red'].status = 3
            }
        }
        else if (this.me == "green") {
            this.obj.players['red'].status = 3
        }

        this.postData('/changeStatus', { obj: this.obj })
            .then(data => {

                if (document.getElementById("button") != null) {
                    let bt = document.getElementById("button")
                    bt.remove()
                }
                if (document.getElementById("kostka") != null) {
                    let kostka = document.getElementById("kostka")
                    setTimeout(function () {
                        kostka.remove()
                    }, 1500)
                }

            });
    }
}

