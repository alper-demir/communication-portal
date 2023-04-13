const express = require("express")
const app = express()
app.use(express.urlencoded({ extended: false }))
const dotenv = require('dotenv').config()
const session = require("express-session")

const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(session({
    secret: 'communication portal',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000 // 60 min
    }
}))

const locals = require("./middlewares/locals")

app.use(locals);

const authRoutes = require("./routers/auth")
const userRoutes = require("./routers/user")


app.set("view engine", "ejs")

app.use(express.static('public/css'));
app.use("/public", express.static("public")); // makes static files reachable under public folder as middleware


app.use("/auth", authRoutes)
app.use("/", userRoutes)

const sequelize = require("./data/db")
const testData = require("./data/test-data")

async function sync() {
    await sequelize.sync({ alter: true })
    // await testData()
}

sync()

app.listen(process.env.PORT, () => {
    console.log("sunucu 3000 de aktif")
})