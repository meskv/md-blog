// will check req.session
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.redirect('/auth/login')
    }
}

module.exports = isAuth