module.exports = (req,res,next) => {
    res.locals.isAuth = req.session.isAuth
    res.locals.image = req.session.image
    res.locals.userName = req.session.username
    res.locals.userId = req.session.userid
    next();
}