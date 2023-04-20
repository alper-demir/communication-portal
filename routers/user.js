const express = require("express")
const router = express.Router()
const Topic = require("../models/topic")
const User = require("../models/user")
const Comment = require("../models/comment")
const FriendRequest = require("../models/friend-request")
const Friendship = require("../models/friendship")

router.get("/", (req, res) => {
    res.render("user/index", {
        title: "index",
    })
})


router.get("/topics", async (req, res) => {

    const topics = await Topic.findAll({
        include: {
            model: User,
            attributes: ['id', 'image', 'firstName', 'lastName']
        }
    })
    console.log(topics)
    res.render("user/topics", {
        title: "Topics",
        topics: topics
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
            { model: User, attributes: ['userName', 'image', 'firstName', 'lastName'] }
        ]
    })
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
        if (user) {
            res.render("user/user-profile", {
                title: user.userName,
                id: user.id,
                firstname: user.firstName,
                lastname: user.lastName,
                username: user.userName,
                profileimage: user.image, // image : user.image olmaz çünkü "image" session ile taşınıyor navbar'daki görselde params id'ye göre değişiyor, hata.
                createdAt: date.toLocaleDateString()
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
        return res.status(200).send({ status: preReq.status })
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
    const { requestId } = req.body
    try {
        // FriendRequest.destroy({
        //     where: {
        //         id: requestId
        //     }
        // })
        FriendRequest.update({ status: "rejected" }, {
            where: {
                id: requestId
            }
        })
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
        await FriendRequest.update({ status: "accepted" }, {
            where: {
                id: requestId
            }
        })
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
                attributes: ["userName", "online"]
            }
        });
        res.status(200).send(friends)
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router