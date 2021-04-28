var express = require("express");
var app = express()
const PORT = 3000;
var path = require("path")

var dotenv = require("dotenv")
dotenv.config()

let Game=require("./serverFiles/gameServer.js");

var game= new Game(process.env.HOST,process.env.USERLOGIN,process.env.PASSWORD,process.env.DATABASE)

app.use(express.json());

app.get("/", function (req, res) {

    console.log("get")
    res.sendFile(path.join(__dirname + "/static/index.html"))
    
})
app.post("/login", async function (req, res) {

    console.log(req.body.name)
    let login = req.body.name
    let thisLoginGame = await game.login(login)
    res.send(JSON.stringify(thisLoginGame))

})
app.post("/check", async function (req, res) {
  
    let id = req.body.id
    let userGame = await game.getGameFromId(id)
    res.send(JSON.stringify(userGame))

})

app.post("/changeState", async function (req, res) {
  
    let id = req.body.id
    let color=req.body.color
    let userGame= await game.changeUserReadyState(id,color)
    res.send(JSON.stringify(userGame))

})

app.post("/changeStatus", async function (req, res) {
  
   console.log(req.body.obj)
   await game.saveGameInDataBase(req.body.obj)
   let userGame = await game.getGameFromId(req.body.obj.id)
   res.send(JSON.stringify(userGame))

})

app.use(express.static("static"))

app.listen(PORT, function () {
    console.log("to jest start serwera na porcie " + PORT)
})
