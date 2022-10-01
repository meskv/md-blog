const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

mongoose.connect(uri, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err, db) => {
    if (err) {
        
        process.exit(1);
    } else {
        
    }
});

const conn = mongoose.createConnection(uri, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = conn;