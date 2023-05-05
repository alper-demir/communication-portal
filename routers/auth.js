const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")


router.get("/register", (req, res) => {
    res.render("auth/register", {
        title: "Register"
    })
})

router.post("/register", async (req, res) => {
    const { name, lastname, username, email, password } = req.body || null;
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if (!user) {
            await User.create({ firstName: name, lastName: lastname, userName: username, email: email, password: await bcrypt.hash(password, 10) })
            return res.redirect("/auth/login")
        }
        return res.render("auth/register", {
            title: "Register",
            message: {
                text: "This email already used",
                type: "Warning"
            },
            name: name,
            lastname: lastname,
            username: username,
            email: email,
            password: password

        })

    }
    catch (error) {
        console.log("Error register:", error)
    }
})

router.get("/login", (req, res) => {
    res.render("auth/login", {
        title: "Login"
    })
})

router.post("/login", async (req, res) => {
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

router.get("/logout", async (req, res) => {

    try {
        delete req.session.isAuth
        await User.update({ online: 0 }, { where: { id: req.session.userid } })
        res.redirect("/auth/login")
    }

    catch (err) {
        console.log(err);
    }
})

module.exports = router