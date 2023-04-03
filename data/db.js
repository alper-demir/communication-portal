const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: "mysql",
    storage : "./session.mysql"
})

async function connect() {
    try {
        await sequelize.authenticate();
        console.log("mysql connection successful.")
    }
    catch (err) {
        console.log("connection error:", err)
    }
}

connect();

module.exports = sequelize;