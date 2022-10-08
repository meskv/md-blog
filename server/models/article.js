const mongoose = require('mongoose');
const slugify = require('slugify');
const { marked } = require('marked');
const createDomPurifier = require('dompurify')
const { JSDOM } = require('jsdom') // putting brackets coz, only importing JSDOM portion
const dompurify = createDomPurifier(new JSDOM().window)


// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         minlength: 2,
//         maxlength: 20,
//         trim: true,
//         default: 'Admin'
//     }
// })


const articleSchema = new mongoose.Schema({
    postImage: {
        type: String,
    },
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
        trim: true
    },
    subtitle: {
        type: String,
        minlength: 2,
        maxlength: 100,
        trim: true
    },
    description: {
        type: String,
    },
    author: {
        type: String,
        default: 'Admin',
    },
    keywords: {
        type: Array,
        default: ['keyword-1', 'keyword random', 'keyword 3']
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHTML: {
        type: String,
        required: true,
    }
}, { timestamps: true });

articleSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }

    if (this.markdown) {
        this.sanitizedHTML = dompurify.sanitize(marked(this.markdown))
    }
    next();
});


module.exports = mongoose.model('Article', articleSchema);
// module.exports = mongoose.model('User', userSchema);