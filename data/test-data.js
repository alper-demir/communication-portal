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
        { title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", userId: 1 },
        { title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", userId: 2 },
        { title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", userId: 3 },
        { title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", userId: 4 },
        { title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", userId: 5 },
        { title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.", userId: 6 },
    ])

    await Comment.bulkCreate([
        { content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis porro soluta vitae eius cupiditate doloremque veritatis illo! Nulla, animi ipsa.", topicId: 1, userId: 1 },
        { content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis porro soluta vitae eius cupiditate doloremque veritatis illo! Nulla, animi ipsa.", topicId: 2, userId: 2 },
        { content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis porro soluta vitae eius cupiditate doloremque veritatis illo! Nulla, animi ipsa.", topicId: 3, userId: 3 },
        { content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis porro soluta vitae eius cupiditate doloremque veritatis illo! Nulla, animi ipsa.", topicId: 4, userId: 4 },
        { content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis porro soluta vitae eius cupiditate doloremque veritatis illo! Nulla, animi ipsa.", topicId: 5, userId: 5 },
        { content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis porro soluta vitae eius cupiditate doloremque veritatis illo! Nulla, animi ipsa.", topicId: 6, userId: 6 },
        { content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis porro soluta vitae eius cupiditate doloremque veritatis illo! Nulla, animi ipsa.", topicId: 5, userId: 1 },
        { content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis porro soluta vitae eius cupiditate doloremque veritatis illo! Nulla, animi ipsa.", topicId: 1, userId: 2 },
        { content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis porro soluta vitae eius cupiditate doloremque veritatis illo! Nulla, animi ipsa.", topicId: 4, userId: 3 },
        { content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis porro soluta vitae eius cupiditate doloremque veritatis illo! Nulla, animi ipsa.", topicId: 2, userId: 6 },
        { content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis porro soluta vitae eius cupiditate doloremque veritatis illo! Nulla, animi ipsa.", topicId: 6, userId: 4 },
        { content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis porro soluta vitae eius cupiditate doloremque veritatis illo! Nulla, animi ipsa.", topicId: 3, userId: 2 }
    ])
}

// Relations

Topic.belongsTo(User, { foreignKey: 'userId' }) // bunları belirtmesekte otomatik olarak kendisi user ve id kelimeleri ile kendi algoritmasını kullanarak ilişkiyi kuruyor
User.hasMany(Topic, { foreignKey: 'userId' })

Topic.hasMany(Comment, { foreignKey: 'topicId' })
Comment.belongsTo(Topic, { foreignKey: 'topicId' })

Comment.belongsTo(User)
User.hasMany(Comment)

module.exports = testData