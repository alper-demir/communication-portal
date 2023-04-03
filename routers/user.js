const express = require("express")
const router = express.Router()


router.get("/", (req, res) => {
    res.render("user/index", {
        title: "index",
        auth : res.locals.isAuth
    })
})

module.exports = router