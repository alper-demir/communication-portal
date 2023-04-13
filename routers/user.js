const express = require("express")
const router = express.Router()
const Topic = require("../models/topic")
const User = require("../models/user")
const Comment = require("../models/comment")

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
module.exports = router