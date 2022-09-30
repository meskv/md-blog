const User = require('../models/user');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.register = async (req, res) => {
    // console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;
    // console.log(name, email, password, passwordConfirm);

    let user = await User.findOne({ email: email })

    if (user) {
        res.render('auth/register', { title: "Register Page", message: "Email already exists", page_name: 'register' })
    } else if (password !== passwordConfirm) {
        res.render('auth/register', { title: "Register Page", message: "Password does not match", page_name: 'register' })
    } else {
        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        // console.log(hashPassword);

        user = new User({
            name: name,
            email: email,
            password: hashPassword
        })

        await user.save();
        res.redirect('/auth/login')
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email })
    // console.log(user);
    if (!user) {
        res.render('auth/login', { title: "Login Page", message: "Email does not exist", page_name: 'login' })
    } else {
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.render('auth/login', { title: "Login Page", message: "Password does not match", page_name: 'login' })
        } else {
            // create and assign a token
            // const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
            // console.log(token);
            // req.session.token = token;
            req.session.isAuth = true;
            req.session.user = user;
            // console.log(req.session);
            res.redirect('/dashboard')
        }
    }
}

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            // return res.redirect('/dashboard')
            throw err
        }
        res.clearCookie(process.env.SESSION_NAME)
        // res.redirect('/auth/login')
        res.render('auth/login', { title: "Login Page", message: "Logout Successful", page_name: 'login' })
    })
}

// (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.log(err);
//             res.send("Error: ", err)
//         } else {
//             res.render('index', { title: "Login Page", logout: "logout successful" })
//         }
//     })
// }