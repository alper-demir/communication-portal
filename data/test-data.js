const User = require("../models/user")
const Topic = require("../models/topic")
const Comment = require("../models/comment")
const bcrypt = require("bcrypt")

const testData = async () => {
    await User.bulkCreate([
        { firstName: "Alper 1", lastName: "Demir 1", userName: "alperdemir1", email: "alper1@gmail.com", password: await bcrypt.hash("123456", 10), image: "1.jpg" },
        { firstName: "Alper 2", lastName: "Demir 2", userName: "alperdemir2", email: "alper2@gmail.com", password: await bcrypt.hash("123456", 10), image: "2.jpg" },
        { firstName: "Alper 3", lastName: "Demir 3", userName: "alperdemir3", email: "alper3@gmail.com", password: await bcrypt.hash("123456", 10), image: "3.jpg" },
        { firstName: "Alper 4", lastName: "Demir 4", userName: "alperdemir4", email: "alper4@gmail.com", password: await bcrypt.hash("123456", 10), image: "4.jpg" },
        { firstName: "Alper 5", lastName: "Demir 5", userName: "alperdemir5", email: "alper5@gmail.com", password: await bcrypt.hash("123456", 10), image: "5.jpg" },
        { firstName: "Alper 6", lastName: "Demir 6", userName: "alperdemir6", email: "alper6@gmail.com", password: await bcrypt.hash("123456", 10), image: "6.jpg" },
    ])

    await Topic.bulkCreate([
        { title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", userId: 1, views: 10, messages: 2, },
        { title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", userId: 2, views: 12, messages: 1, },
        { title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", userId: 3, views: 13, messages: 4, },
        { title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", userId: 4, views: 14, messages: 7, },
        { title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", userId: 5, views: 15, messages: 0, },
        { title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", userId: 6, views: 16, messages: 2, },
    ])
}


Topic.belongsTo(User, { foreignKey: 'userId' }) // bunları belirtmesekte otomatik olarak kendisi user ve id kelimeleri ile kendi algoritmasını kullanarak ilişkiyi kuruyor
User.hasMany(Topic, { foreignKey: 'userId' })

Topic.hasMany(Comment, { foreignKey: 'topicId' })
Comment.belongsTo(Topic, { foreignKey: 'topicId' })
module.exports = testData