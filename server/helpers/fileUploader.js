const dotenv = require('dotenv')
dotenv.config()

const bucketName = process.env.POST_IMAGE_BUCKET;
// console.log(bucketName);

// mongodb stuffs
const mongoose = require('mongoose')
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')

const express = require('express')
router = express.Router()

// init db connection
const promise = mongoose.createConnection(process.env.MONGO_URI, { useNewUrlParser: true });
const conn = mongoose.connection;

// Init gfs
let gfs, gridfsBucket;

conn.once('open', () => {
    // init stream
    // Add this line in the code
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: bucketName
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection(bucketName)
})

// storage engine
const storage = new GridFsStorage({
    url: `${process.env.MONGO_URI}/${process.env.DB_NAME}`,
    db: conn,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    // bucketName: 'uploads', // should match collection name
                    bucketName: bucketName, // should match collection name
                };
                resolve(fileInfo);
            });
        });
    }
});

fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const maxSize = 3 * 1024 * 1024;
const upload = multer({ storage: storage }, { fileFilter: fileFilter }, { limits: { fileSize: maxSize } });

module.exports = {
    upload,
    gfs,
    gridfsBucket
};