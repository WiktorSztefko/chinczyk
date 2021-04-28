var mysql = require("mysql")
module.exports = class Game {
    constructor(host, user, password, database) {
        this.host = host
        this.user = user
        this.password = password
        this.database = database
        this.colors = ["red", "blue", "yellow", "green"]
        this.init()
    }

    init() {
        this.connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
        });

        this.connection.connect(function (err) {
            if (err) throw err;
        })
    }

    async login(login) {
        let lastRecord = await this.getLastRecordFromDatabase()
        //console.log("to jest lastRecord: " + JSON.stringify(lastRecord))
        if (lastRecord.players == undefined || lastRecord.players.green != undefined || lastRecord.started == "1") {
           // console.log("tworzenie nowej gry")
            await this.createNewGame(login)
        } else {
            //console.log("dodanie do ostatniej gry")
            await this.addToLastGame(login, lastRecord)
        }
        return await this.getLastRecordFromDatabase()
    }

    getLastRecordFromDatabase() {

        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM games ORDER BY id DESC LIMIT 1", function (err, result, fields) {
                if (err) throw err;
                if (result.length > 0 && result[0].players != "") {
                    //console.log("To jest result: "+JSON.stringify(result)) //pobrany rekord to tablica jednoelementowa
                    result[0].pawns = JSON.parse(result[0].pawns)
                    result[0].players = JSON.parse(result[0].players)
                }
                else {
                    result[0] = {}
                }
                resolve(result[0])
            })
        });
    }
    async createNewGame(login) {

        let players = {
            red: {
                nick: login,
                lastActive: null,
                status: 0,
            }
        }
        let pawns = {
            red: [40, 41, 42, 43],
        }
        await this.createGameInDataBase(players, pawns)
    }

    createGameInDataBase(players, pawns) {
        let playersString = JSON.stringify(players)
        let pawnsString = JSON.stringify(pawns)
        let query = `INSERT into games(players,pawns,started) values('${playersString}','${pawnsString}',"0")`
        return new Promise((resolve, reject) => {
            this.connection.query(query, function (err, result) {
                // console.log("---------------------------------")
                // console.log(result)
                // console.log("---------------------------------")
                if (err) throw err;
                resolve(result[0])
            })
        });
    }

    async addToLastGame(login, lastGame) {
        //console.log(lastGame)
        lastGame = this.addPlayer(login, lastGame)
        if (lastGame.players.green != undefined) {
            lastGame = this.startGame(lastGame)
        }
        await this.saveGameInDataBase(lastGame)
    }

    addPlayer(login, lastGame) {
        let color
        let pawns
        if (lastGame.players.blue == undefined) { //lecimy kolejno kolejnych graczy, każdy ma inny kolor i inne pozycje pionków
            color = "blue"
            pawns = [44, 45, 46, 47]
        } else if (lastGame.players.yellow == undefined) {
            color = "yellow"
            pawns = [48, 49, 50, 51]
        }
        else {
            color = "green"
            pawns = [52, 53, 54, 55]
        }

        let player = {
            nick: login,
            lastActive: null,
            status: 0,
        }

        lastGame.players[color] = player
        lastGame.pawns[color] = pawns

        return lastGame
    }

    saveGameInDataBase(game) {

        let playersGame= JSON.stringify(game.players)
        let pawnsGame= JSON.stringify(game.pawns)

        let query = `UPDATE games SET players='${playersGame}', pawns='${pawnsGame}', started=${game.started} WHERE id='${game.id}'`
        return new Promise((resolve, reject) => {
            this.connection.query(query, function (err, result) {
                if (err) throw err;
                resolve(result[0])
            })
        });
    }

    getGameFromId(id) {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT * FROM games WHERE id=${id}`, function (err, result, fields) {
                if (err) throw err;

               // console.log("To jest getGameFromId " + JSON.stringify(result));

                if (result.length > 0 && result[0].players != "") {
                    result[0].pawns = JSON.parse(result[0].pawns)
                    result[0].players = JSON.parse(result[0].players)
                }
                else {
                   // console.log("result był pusty")
                    result[0] = {}
                }
                //console.log(result);
                resolve(result[0])
            })
        });
    }

    startGame(lastGame) {
        //console.log("start last game:", lastGame)

        for (let key in lastGame.players) {
            lastGame.players[key].status = 2
        }
        lastGame.players.red.status = 3 //czerwony zaczyna zawsze

        lastGame.started = "1"
        return lastGame
    }

    async changeUserReadyState(id, color) {
        let game = await this.getGameFromId(id)

        if (game.players[color].status == 0) {
            game.players[color].status = 1
        } else {
            game.players[color].status = 0
        }

        let readyCount = 0
        for (let key in game.players) {
            if (game.players[key].status != 0) {
                readyCount++
            }
        }
        if (readyCount > 1) {
            this.startGame(game)
        }

        this.saveGameInDataBase(game)
        return game
    }

}