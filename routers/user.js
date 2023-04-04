const express = require("express")
const router = express.Router()


router.get("/", (req, res) => {
    res.render("user/index", {
        title: "index",
    })
})

module.exports = router