const express = require("express")
const session = require("express-session")
const fileUpload = require("express-fileupload")
const path = require("path")
const lessMiddleware = require("less-middleware")

const app = express()
const port = 3000

app.use(lessMiddleware(__dirname, + "public" ))
app.use(express.urlencoded({ extended: false })) //Global function that runs on every request

app.use(session({
    secret: 'The session',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

var sess;

app.use(getWeather)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, "/public")))

function getWeather(req, res, next) { //Middleware, call next to move on to the next function
    req.visitorWeather = true
    req.visitorWeather ? next() : res.send("Please come back not rain")
}

//route
app.get('/', (req, res) => { //request, response
    const isRaining = req.visitorWeather ? "It is raining" : "It is not raining"
    res.render("home", {
        isRaining: req.visitorWeather,
        pets: [
            { name: "Oliver", species: "cat" }, 
            { name: "Sebastian", species: "elephant" }
        ]
    })//Ternary Conditional operator

}) //new result route

app.get('/about', (req, res) => { //request, response. The first thing that express passes into the function is an object that represents the incoming request from the visitor, the second parameter is a response object
    res.send("Thanks for learning")
})

app.post('/result', (req, res) => {
    if (req.body.color.trim().toLowerCase() == "blue") { //trim method removes spaces, toLowerCase will convert the text into lowercase
        res.send("That is correct.")
    } else {
        res.send("incorrect")
    }
})

app.get('/result', (req, res) => {
    res.send("Why.")
})

app.get("/api/pets", (req, res) => {
    res.json([
        { name: "Oliver", species: "cat" }, 
        { name: "Sebastian", species: "elephant" }
    ])
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})