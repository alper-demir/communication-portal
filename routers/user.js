const express = require("express")
const router = express.Router()
const Topic = require("../models/topic")
const User = require("../models/user")
const Comment = require("../models/comment")
const FriendRequest = require("../models/friend-request")
const Friendship = require("../models/friendship")
const Messages = require("../models/messages")
const auth = require("../middlewares/auth")
const { Op } = require("sequelize")
const bcrypt = require("bcrypt")

router.get("/", (req, res) => {
    res.render("auth/login", {
        title: "Login",
    })
})

router.post("/", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.render("auth/login", {
                message: {
                    text: "Please check your informations",
                    type: "Warning"
                },
                title: "Login",
                email: email,
                password: password
            }
            )
        }
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) {
            return res.render("auth/login", {
                message: {
                    text: "Password is wrong",
                    type: "Warning"
                },
                title: "Login",
                email: email,
                password: password

            }
            )
        }
        req.session.isAuth = true
        req.session.image = user.image
        req.session.username = user.userName
        req.session.userid = user.id
        console.log("auth: " + req.session.isAuth)
        await User.update({ online: true }, { where: { id: user.id } })
        return res.redirect("/topics")
    }
    catch (error) {
        console.log(error)
    }
})

router.get("/topics", async (req, res) => {

    const topics = await Topic.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'image', 'userName', 'createdAt'],
            },
            {
                // get the information of the user who sent the last message to the topics
                model: Comment,
                include: [
                    {
                        model: User,
                        attributes: ['id', 'userName'],
                    }
                ],
                order: [['updatedAt', 'DESC']],
                limit: 1,
            }
        ],
        order: [['updatedAt', 'DESC']]
    })
    console.log(topics)
    res.render("user/topics", {
        title: "Topics",
        topics: topics,
    })
})

router.post("/topics", async (req, res) => {
    const { title, content } = req.body
    console.log(req.body)
    try {
        const createdTopic = await Topic.create({
            title: title,
            userId: req.session.userid
        })
        console.log("topicid" + createdTopic.id)
        await Comment.create({
            content: content,
            topicId: createdTopic.id,
            userId: req.session.userid
        })
        await Topic.increment('messages', { by: 1, where: { id: createdTopic.id } });
        res.redirect("/topics")
    }
    catch (error) {
        console.log("Error occured during topic creation:", error)
    }
})

router.get("/topic/:id", async (req, res) => {
    const topicId = req.params.id
    try{
        let visitedTopics = req.cookies.visited_topics || [];
        if (!visitedTopics.includes(topicId)) {
            Topic.increment('views', { where: { id: topicId } });
            visitedTopics.push(topicId);
            res.cookie('visited_topics', visitedTopics, { maxAge: 1000 * 60 * 60 }); // 60 min
        }
    
        const comments = await Comment.findAll({
            where: {
                topicId: topicId
            },
            include: [
                {
                    model: Topic, include: {
                        model: User,
                        attributes: ['firstName', 'lastName',]
                    },
                    attributes: ['title', 'createdAt', 'id']
                },
                { model: User, attributes: ['userName', 'image', 'firstName', 'lastName','id'] }
            ]
        })
        if(comments.length < 1){
            res.redirect("/topics")
        }
        console.log(comments)
        const date = new Date(comments[0].topic.createdAt)
        const day = date.getDate()
        const month = date.toLocaleString('en-GB', { month: 'long' })
        const year = date.getFullYear()
        const formattedDate = `${day} ${month} ${year} - ${date.toLocaleTimeString("tr-TR")}`
        res.render("user/topic-details", {
            title: comments[0].topic.title,
            comments: comments,
            date: formattedDate
        })
    }

    catch(err){
        console.log(err)
    }
    
})

router.post("/topic/:id", async (req, res) => {
    const { content, topicid } = req.body

    try {
        if (topicid == req.params.id) {
            await Comment.create({ content: content, userId: req.session.userid, topicId: topicid })
            await Topic.increment('messages', { by: 1, where: { id: topicid } });
            res.redirect(`/topic/${topicid}`)
        }
    }
    catch (error) {
        console.log("Error occured during comment addition" + error)
    }
})

router.get("/user/:id", async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findOne({
            where: {
                id,
            }
        })
        const date = new Date(user.createdAt)
        let friendship = false

        let isRequestTrue = false
        if (req.session.userid) {
            const isRequest = await FriendRequest.findOne({
                where: {
                    requesterId: id,
                    receiverId: req.session.userid,
                    status: "pending"
                }
            })
            isRequest ? isRequestTrue = true : isRequestTrue = false
        }


        if (user) {
            let friendship = false
            if (req.session.userid) {
                const isFriend = await Friendship.findOne({
                    where: {
                        userId: req.session.userid,
                        friendId: id
                    }
                })
                isFriend ? friendship = true : friendship = false
            }

            res.render("user/user-profile", {
                title: user.userName,
                id: user.id,
                firstname: user.firstName,
                lastname: user.lastName,
                username: user.userName,
                profileimage: user.image, // image : user.image olmaz çünkü "image" session ile taşınıyor navbar'daki görselde params id'ye göre değişiyor, hata.
                createdAt: date.toLocaleDateString(),
                friendship,
                isRequest: isRequestTrue
            })
        }
        else {
            res.redirect("/")
        }
    }
    catch (error) {
        console.log(error)
    }


})

router.post("/api/friendship-delete", async (req, res) => {
    const { userId, friendId } = req.body
    try {
        const deleteFriend = await Friendship.destroy({
            where: {
                userId,
                friendId
            }
        })
        await Friendship.destroy({
            where: {
                userId: friendId,
                friendId: userId
            }
        })
        if (deleteFriend) {
            res.status(200).send({ message: "Friend deleted" })
        }
    }
    catch (error) {
        console.log("Error occured during unfriend: " + error)
    }
})

router.post("/api/friend-request", async (req, res) => {
    const { requesterId, receiverId } = req.body

    const preReq = await FriendRequest.findOne({
        where: {
            requesterId,
            receiverId,
            status: "pending"
        }
    })

    if (preReq) {
        await FriendRequest.destroy({
            where: {
                requesterId,
                receiverId
            }
        })
        return res.status(200).send({ status: "Friend Request" })
    }

    if (requesterId && receiverId) {
        try {
            await FriendRequest.create({ requesterId, receiverId })
            return res.status(200).send({ message: "successful", status: "pending" })
        }
        catch (error) {
            console.log("Error occured during friend request " + error)
        }
    }
    else {
        res.status(404).send({ message: "value missing" })
    }
})

router.post("/api/friend-request-status", async (req, res) => {
    const { requesterId, receiverId } = req.body
    console.log(requesterId)
    console.log(receiverId)

    try {
        const list = await FriendRequest.findOne({
            where: {
                requesterId: requesterId,
                receiverId: receiverId,
                status: "pending" //opt
            }
        })
        if (list) {
            res.json(list)
        }
    }
    catch (error) {
        console.log(error)
    }
})

router.post("/api/request-status", async (req, res) => {
    const { requestedId } = req.body
    console.log(requestedId)
    try {
        const response = await FriendRequest.findAll({
            where: {
                receiverId: requestedId,
                status: "pending"
            },
            attributes: ['id', 'requesterId'],
            include: {
                model: User,
                attributes: ['userName'],
            }
        })
        console.log(response)
        if (response) {
            return res.status(200).send({ requesters: response })
        }
    }
    catch (err) {
        console.log(err)
    }
})

router.post("/api/reject-request", async (req, res) => {
    const { requestId, userId, friendId } = req.body
    try {
        // FriendRequest.destroy({
        //     where: {
        //         id: requestId
        //     }
        // })
        if (!requestId) {
            FriendRequest.update({ status: "rejected" }, {
                where: {
                    requesterId: userId,
                    receiverId: friendId
                }
            })
        }
        else {
            FriendRequest.update({ status: "rejected" }, {
                where: {
                    id: requestId
                }
            })
        }
        return res.status(200).send({ message: "accepted" })
    }
    catch (err) {
        console.log(err)
    }
})

router.post("/api/accept-request", async (req, res) => {
    const { userId, friendId, requestId } = req.body
    try {
        await Friendship.create({ userId, friendId })
        await Friendship.create({ userId: friendId, friendId: userId })
        if (!requestId) {
            await FriendRequest.update({ status: "accepted" }, {
                where: {
                    requesterId: userId,
                    receiverId: friendId
                }
            })
        }
        else {
            await FriendRequest.update({ status: "accepted" }, {
                where: {
                    id: requestId
                }
            })
        }
        return res.status(200).send({ message: "accepted" })
    }
    catch (err) {
        console.log(err)
    }
})

router.post("/api/friend-status", async (req, res) => {
    const { userId } = req.body
    try {
        const friends = await Friendship.findAll({
            where: {
                userId
            },
            include: {
                model: User,
                as: 'friend', // relation variable
                attributes: ["userName", "online", "id"]
            }
        });
        res.status(200).send(friends)
    }
    catch (err) {
        console.log(err)
    }
})

router.get("/chat/:friendId", auth, async (req, res) => {
    const friendId = req.params.friendId
    const userId = req.session.userid;
    const roomId = [userId, friendId].sort().join("-");
    const friend = await User.findByPk(friendId, { attributes: ['image', 'id'] })
    res.render("user/chat", {
        title: roomId,
        roomId,
        friendImage: friend.image,
        friendId: friend.id
    })
})

router.post("/api/save-message", async (req, res) => {
    const { message, roomId, senderId, receiverId } = req.body
    try {
        await Messages.create({ roomId, senderId, receiverId, message })
    }
    catch (err) {
        console.log(err)
    }
})

router.get("/api/messages/:room", async (req, res) => {
    const roomId = req.params.room
    try {
        const messages = await Messages.findAll({
            where: {
                roomId,
            },
            include: {
                model: User,
                as: "friend",
                attributes: ["image"]
            }
        })
        if (messages) {
            res.status(200).send({ messages })
        }
    }
    catch (err) { console.log(err) }
})

router.post("/api/messages-notify/:user", async (req, res) => {
    const id = req.params.user
    try {
        const notification = await Messages.findAll({
            where: {
                receiverId: id,
                isRead: false
            },
        })
        if (notification) {
            res.status(200).send(notification)
        }
    }
    catch (error) {
        console.log("notification error" + error)
    }
})

router.get("/search", async (req, res) => {
    const key = req.query.q

    const topics = await Topic.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'image', 'userName', 'createdAt'],
            },
            {
                // get the information of the user who sent the last message to the topics
                model: Comment,
                include: [
                    {
                        model: User,
                        attributes: ['id', 'userName'],
                    }
                ],
                order: [['updatedAt', 'DESC']],
                limit: 1,
            }
        ],
        order: [['views', 'DESC']],
        where: { title: { [Op.like]: `%${key}%` } },
        limit: 10
    })

    const users = await User.findAll({
        where: { username: { [Op.like]: `%${key}%` } },
        limit: 10
    });

    res.render("user/searched", { title: key, topics, users, })
})

router.get("/popular-topics", async (req, res) => {
    try {
        const topics = await Topic.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'image', 'userName', 'createdAt'],
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'userName'],
                        }
                    ],
                    order: [['updatedAt', 'DESC']],
                    limit: 1,
                }
            ],
            order: [['Views', 'DESC']],
            limit: 20
        })
        res.render("user/topics", {
            topics,
            title: "Popular Topics"
        })
    }
    catch (error) {
        console.log(error)
    }
})

router.post("/popular-topics", async (req, res) => {
    const { title, content } = req.body
    console.log(req.body)
    try {
        const createdTopic = await Topic.create({
            title: title,
            userId: req.session.userid
        })
        console.log("topicid" + createdTopic.id)
        await Comment.create({
            content: content,
            topicId: createdTopic.id,
            userId: req.session.userid
        })
        await Topic.increment('messages', { by: 1, where: { id: createdTopic.id } });
        res.redirect("/popular-topics")
    }
    catch (error) {
        console.log("Error occured during topic creation:", error)
    }
})

router.get("/new-topics", async (req, res) => {
    try {

        const topics = await Topic.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'image', 'userName', 'createdAt'],
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'userName'],
                        }
                    ],
                    order: [['updatedAt', 'DESC']],
                    limit: 1,
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 20
        })
        res.render("user/topics", {
            topics,
            title: "New Topics"
        })
    }
    catch (error) {
        console.log(error)
    }
})

router.post("/new-topics", async (req, res) => {
    const { title, content } = req.body
    console.log(req.body)
    try {
        const createdTopic = await Topic.create({
            title: title,
            userId: req.session.userid
        })
        console.log("topicid" + createdTopic.id)
        await Comment.create({
            content: content,
            topicId: createdTopic.id,
            userId: req.session.userid
        })
        await Topic.increment('messages', { by: 1, where: { id: createdTopic.id } });
        res.redirect("/new-topics")
    }
    catch (error) {
        console.log("Error occured during topic creation:", error)
    }
})

module.exports = router