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
        await Comment.create({
            content: content,
            topicId: createdTopic.id
        })
        res.redirect("/topics")
    }
    catch (error) {
        console.log("Error occured during topic creation")
    }
})

module.exports = router