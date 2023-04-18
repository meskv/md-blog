const Article = require('../models/article');
const { upload } = require('../helpers/fileUploader');
// const User = require('../models/article');

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

// @route   GET /articles/new
// @desc    Create new article
router.get('/new', isAuth, (req, res) => {
    res.render('articles/new', {
        title: 'New Article',
        article: new Article(),
    });
}
);

// @route   GET /edit/:id
// @desc    Edit article
router.get('/edit/:id', isAuth, async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', {
        title: 'Edit Article',
        article: article,
    });
}
);

// @route   POST /articles with image
// @desc    Create an article
router.post('/', upload.single('postImage'), async (req, res) => {
    // const newArticle = new Article(req.body);
    const newArticle = new Article({
        name: req.body.name,
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        postImage: req.file.filename
    })
    console.log(newArticle, req.file);
    try {
        const article = await newArticle.save();
        if (!article) throw Error('Error while saving article');
        // res.status(200).json(article);
        res.redirect(`/articles/${article.slug}`);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// // @route   POST /articles
// // @desc    Create an article
// router.post('/', async (req, res) => {
//     const newArticle = new Article(req.body);
//     try {
//         const article = await newArticle.save();
//         if (!article) throw Error('Error while saving article');
//         // res.status(200).json(article);
//         res.redirect(`/articles/${article.slug}`);
//     } catch (e) {
//         res.status(400).json({ msg: e.message });
//     }
// });

// // @route GET /:id
// // @desc Get a page
// router.get('/:id', async (req, res) => {
//     try {
//         const article = await Article.findById(req.params.id);
//         if (!article) res.redirect('/');
//         res.render('articles/show', {
//             article: article,
//         });
//         // res.status(200).json(article);
//     } catch (e) {
//         res.status(400).json({ msg: e.message });
//     }
// });

// @route GET /:slug
// @desc Get a page
router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        console.log(req.params.slug);
        console.log(article);
        if (!article) res.redirect('/')

        res.render('articles/article', {
            article: article,
            title: article.title,
        });
        // res.status(200).json(article);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// @route   DELETE article/:id
// @desc    Delete an article
// A link only allow get while form only allow post
// method-override is used to allow delete and put
// router.delete('/:id', async (req, res) => {
//     await Article.findOneAndDelete(req.params.id)

// })
router.delete('/:id', isAuth, async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) throw Error('No article found');
        // res.status(200).json({ success: true });
        res.redirect('/dashboard')

    } catch (e) {
        res.status(400).json({ msg: e.message, success: false });
    }
});

// // @route   UPDATE article/:id
// // @desc    Update an article
// router.put('/:id', async (req, res) => {
//     try {
//         const article = await Article.findByIdAndUpdate(req.params.id, req.body);
//         if (!article) throw Error('Something went wrong while updating the article');

//         // res.status(200).json({ success: true });
//         // res.redirect(`/articles/${article.slug}`);
//         setTimeout(function () {
//             res.redirect(`/articles/${article.slug}`);
//         }, 000);
//     } catch (e) {
//         // res.status(400).json({ msg: e.message, success: false });
//         res.render('articles/edit', {
//             message: 'Error while updating article',
//         });
//     }
// });


// @route   UPDATE article/:id
// @desc    Update an article
router.put('/:id', upload.single('postImage'), async (req, res) => {
    let article = await Article.findById(req.params.id);
    // const newArticle = new Article(req.body);
    article.name = req.body.name;
    article.title = req.body.title;
    article.subtitle = req.body.subtitle;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    article.postImage = req.file.filename;
    try {
        article = await article.save();
        if (!article) throw Error('Something went wrong while updating the article');

        // res.status(200).json({ success: true });
        // res.redirect(`/articles/${article.slug}`);
        setTimeout(function () {
            res.redirect(`/articles/${article.slug}`);
        }, 000);

    } catch (e) {
        // res.status(400).json({ msg: e.message, success: false });
        res.render('articles/edit', {
            message: 'Error while updating article',
        });
    }
});


module.exports = router;