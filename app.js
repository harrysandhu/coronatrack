var express = require("express")
var path = require("path")
var app = express()

var server = require("http").Server(app)
var io = require('socket.io')(server)
//v2 api

var media = require("./api/media")
var bodyParser = require("body-parser")
var morganLogger = require("morgan")


/** api v3 endpoints */

var auth = require("./api/v1/auth")



var cors = require('cors')

const PORT = 4040
app.use(cors())

app.use(morganLogger('dev'))

app.use(express.static('private'))
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }))
app.set('json spaces', 2);

server.listen(PORT, () =>{
    console.log("listening on port :" , PORT)
})

app.get("/text", (req, res) =>{
    res.sendFile(path.join(__dirname, "/text.html"))
})


app.get("/text2", (req, res) =>{
    res.sendFile(path.join(__dirname, "/text2.html"))
})


app.use("/media", media)
//v2 development api


/*v3 api*/

app.use("/api/v1/auth", auth)


