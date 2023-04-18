const conn = require('../database/database');

const dotenv = require('dotenv')
dotenv.config()

const bucketName = process.env.POST_IMAGE_BUCKET;

// will check req.session
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        return
    }
}

// mongodb stuffs
const mongoose = require('mongoose')
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')

const express = require('express')
router = express.Router()

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

const maxSize = 2 * 1024 * 1024;

// storage engine
const storage = new GridFsStorage({
    url: `${process.env.MONGO_URI}/${process.env.DB_NAME}`,
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
const upload = multer({ storage, limits: { fileSize: maxSize } });


// @route GET /
router.get('/', isAuth, (req, res) => {
    // res.render('file/index')
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.render('file/index', { files: false });
        } else {
            files.map(file => {
                if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });
            res.render('file/index', { files: files });
        }
    });
})

// @route POST /upload
// @desc Uploads file to DB
router.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    res.json({ file: req.file })
    // res.redirect('/')
})

// @route GET /files
// @desc Display all files in JSON
router.get('/all-files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        // Files exist
        return res.json(files);
    });
});

// @route GET /files/:filename
// @desc Display single file object
router.get('/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // File exists
        return res.json(file);
    });
});

// @route DELETE /files/:filename
// @desc  Delete file
router.delete('/:filename', async (req, res) => {
    console.log(req.params.filename);
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) {
        return res.status(404).json({
            err: 'No file exists'
        });
    }
    const gsfb = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: bucketName });
    gsfb.delete(file._id, function (err, gridStore) {
        if (err) {
            res.status(500).json({ message: 'Error deleting file' });
        }
        // res.status(200).json({ message: `File with filename ${req.params.filename} deleted successfully` });
        res.redirect('/files',);
    });
});


// @route GET /display/:filename
// @desc Display a files
router.get('/display/:filename', async (req, res) => {
    await gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // Check if PDF
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'application/pdf') {
            const readStream = gridfsBucket.openDownloadStream(file._id);
            readStream.pipe(res);

        } else {
            res.status(404).json({
                err: 'Not a Image or PDF'
            });
        }

    });
});

module.exports = router;