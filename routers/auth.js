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
    const { name, lastname, email, password } = req.body || null;
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if (!user) {
            await User.create({ firstName: name, lastName: lastname, email: email, password: await bcrypt.hash(password, 10) })
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
        console.log("auth: " + req.session.isAuth)
        return res.redirect("/")
    }
    catch (error) {
        console.log(error)
    }
})

router.get("/logout", async (req, res) => {

    try {
        delete req.session.isAuth
        res.redirect("/auth/login")
    }
    
    catch (err) {
        console.log(err);
    }
})

module.exports = router