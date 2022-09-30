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
        console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
        process.exit(1);
    } else {
        console.log(`connection succeeded to DB: ${DB_NAME}`);
    }
});

const conn = mongoose.createConnection(uri, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = conn;