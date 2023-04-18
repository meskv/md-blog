const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session')
const bodyparser = require('body-parser');
var MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path')
const { v4: uuidv4 } = require('uuid')



const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json())
app.use(morgan('dev'));

var store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    databaseName: process.env.DB_NAME,
    collection: process.env.SESSION_NAME
});

app.use(session({
    secret: uuidv4(), // will get hash value(uuid module)
    resave: false,
    saveUninitialized: true,
    store: store
}))

// view engine
app.set('view engine', 'ejs');

// static files
app.use('/public', express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use(methodOverride('_method'));

// routes
app.use('/', require('./server/routes/pageRouter'));
app.use('/articles', require('./server/routes/articleRouter'));
app.use('/auth', require('./server/routes/authRouter'));
app.use('/files', require('./server/routes/fileRouter'));

// 404 page
app.get('*', (req, res) => {
    res.status(404).render('404');
});

// database
require('./server/database/database');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});