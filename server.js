var express = require("express");
var app = express()
const PORT = 3000;
var path = require("path")
var mysql = require("mysql")


var con = mysql.createConnection({
    host: "	mysql.ct8.pl",
    user: "	m22186_root",
    password: "Zaq!2wsx",
    database:"m22186_chinczyk",
});

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
// });


var bodyParser = require("body-parser")



app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    console.log("get")
    res.sendFile(path.join(__dirname + "/static/index.html"))
})
app.post("/login", function (req, res) {
    console.log(req.body.name)
    let login = req.body.name

    // let lastRecord = getLastRecord()

    // if (lastRecord.player4) {
    //     createNewGame()
    // }
    // else {
    //     addToLastGame(login)
    // }

    let thisLoginName = getLastRecord()

    res.send(JSON.stringify(thisLoginName))

})

function getLastRecord(){
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM games", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          return result
        });
      });
}

app.use(express.static("static"))

app.listen(PORT, function () {
    console.log("to jest start serwera na porcie " + PORT)
})