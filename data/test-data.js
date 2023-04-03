const User = require("../models/user")
const bcrypt = require("bcrypt")

const testData = async () => {
    await User.bulkCreate([
        { firstName: "Alper 1", lastName: "Demir 1", email: "alper1@gmail.com", password: await bcrypt.hash("123456", 10), image: "1.jpg" },
        { firstName: "Alper 2", lastName: "Demir 2", email: "alper2@gmail.com", password: await bcrypt.hash("123456", 10), image: "2.jpg" },
        { firstName: "Alper 3", lastName: "Demir 3", email: "alper3@gmail.com", password: await bcrypt.hash("123456", 10), image: "3.jpg" },
        { firstName: "Alper 4", lastName: "Demir 4", email: "alper4@gmail.com", password: await bcrypt.hash("123456", 10), image: "4.jpg" },
        { firstName: "Alper 5", lastName: "Demir 5", email: "alper5@gmail.com", password: await bcrypt.hash("123456", 10), image: "5.jpg" },
        { firstName: "Alper 6", lastName: "Demir 6", email: "alper6@gmail.com", password: await bcrypt.hash("123456", 10), image: "6.jpg" },
    ])
}
module.exports = testData

