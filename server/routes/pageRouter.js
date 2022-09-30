const Article = require('../models/article');

const express = require('express');
const router = express.Router();

// will check req.session
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.redirect('/auth/login')
    }
}

// @route   GET /
// @desc    Home page
// @access  Public
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        if (!articles) throw Error('No articles found');
        // res.status(200).json(articles);
        res.render('index', {
            articles: articles,
            title: 'Blog'
        });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// @route   GET /auth/register
// @desc    Register page
router.get("/auth/register", (req, res) => {
    res.render('auth/register', { title: "Registration Page", page_name: 'register' })
})

// @route   GET /auth/login
// @desc    Login page
router.get("/auth/login", (req, res) => {
    res.render('auth/login', { title: "Login Page", page_name: 'login' })
})

// @route   GET article
// @desc    Get all article
router.get('/dashboard', isAuth, async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        if (!articles) throw Error('No articles');
        // res.status(200).json(articles);
        res.render('articles/dashboard', {
            articles: articles,
            page_name: 'dashboard',
            title: 'Dashboard',
            user: req.session.user.name,
            isAdmin: req.session.user.isAdmin
        });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});


module.exports = router;