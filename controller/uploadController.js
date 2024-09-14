const multer = require('multer');
const prisma = require('../db/prismaClient');
const appRootPath = require('app-root-path');

function getUpload(req, res) {
    res.render('upload', { user: req.user });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folderPath = `${appRootPath}/uploads/${req.user.id}`;
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        cb(null, uniquePrefix + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage });

async function postUpload(req, res) {
    // totalBytes / (1024*1024)
    if (!req.file) {
        res.status(400).redirect('/upload');
        return
    }
    const sizeInMB = parseFloat((req.file.size / (1024 * 1024)).toFixed(2));
    await prisma.resource.create({
        data: {
            path: req.file.path,
            ownerId: req.user.id,
            size: sizeInMB,
            name: req.file.originalname
        }
    })
    res.redirect('/upload');
}

module.exports = {
    getUpload,
    upload,
    postUpload
}