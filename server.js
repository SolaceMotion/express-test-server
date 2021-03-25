const express = require("express")
const session = require("express-session")
const fileUpload = require("express-fileupload")
const path = require("path")
const lessMiddleware = require("less-middleware")

const app = express()


app.use(lessMiddleware(__dirname, + "public" ))
app.use(express.urlencoded({ extended: false })) //Global function that runs on every request

app.use(fileUpload({
   
}))

app.use(session({
    secret: 'The session',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

let sess;

app.use(getWeather)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, "/public")))
app.use(express.static(path.join(__dirname, "/tmp")))

function getWeather(req, res, next) { //Middleware, call next to move on to the next function
    req.visitorWeather = true
    req.visitorWeather ? next() : res.send("Please come back not rain")
}

//route
app.get('/', (req, res) => { //request, response
    const isRaining = req.visitorWeather ? "It is raining" : "It is not raining"
    res.render("home", {
        isRaining,
        pets: [
            { name: "Oliver", species: "cat" }, 
            { name: "Sebastian", species: "elephant" }
        ]
    })//Ternary Conditional operator

}) //new result route

app.get('/about', (req, res) => { //request, response. The first thing that express passes into the function is an object that represents the incoming request from the visitor, the second parameter is a response object
    res.send("Thanks for learning")
})

/* app.get('/result', (req, res) => {
    res.send("You didn't submit the form")
}) */

app.post('/result', (req, res) => {
    if (!req.files || Object.keys(req.files).length == 0) {
        return res.status(400).send("No files uploaded")
    } //instead of else, if something returns it wil jump out and stop executing.

    let uploadPath = path.join(__dirname, '/tmp', req.files.file.name)

    req.files.file.mv(uploadPath, err => {
        if (err) return res.status(500).sendDate(err)
    })

    res.send(`
        <p>Your uploaded file</p>
        <img width="400" src="/${req.files.file.name}" alt="Uploaded File">
    `)
})

app.get("/api/pets", (req, res) => {
    res.json([
        { name: "Oliver", species: "cat" }, 
        { name: "Sebastian", species: "elephant" }
    ])
})

const port = 3000

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
