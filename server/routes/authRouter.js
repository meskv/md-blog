const authController = require('../controllers/authController');

const express = require('express')
const router = express.Router()

// will check req.session
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.redirect('/auth/login')
    }
}

// login user
router.post('/register', isAuth, authController.register)

// login user
router.post('/login', authController.login)

// logout user
router.get("/logout", authController.logout)

module.exports = router;