const express = require("express")
const app = express()
app.use(express.urlencoded({ extended: false }))
const dotenv = require('dotenv').config()
const session = require("express-session")
const sequelize = require("./data/db")


const SequelizeStore = require("connect-session-sequelize")(session.Store);

// socket
const http = require("http")
const server = http.createServer(app)
const socketio = require("socket.io")
const io = socketio(server)

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on('message', (messageData) => {
        console.log(`Message received: ${messageData.message, messageData.roomId}`);
        io.to(messageData.roomId).emit('message', messageData);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});


const cookieParser = require('cookie-parser')
app.use(cookieParser())

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'communication portal',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000 // 60 min
    },
    store: new SequelizeStore({
        db: sequelize
    })
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

const testData = require("./data/test-data")

async function sync() {
    await sequelize.sync({ force: true })
    await testData()
}

sync()

server.listen(process.env.PORT, () => {
    console.log(`server running on ${process.env.PORT}`)
})