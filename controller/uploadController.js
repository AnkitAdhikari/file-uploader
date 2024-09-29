const multer = require('multer');
const prisma = require('../db/prismaClient');
const appRootPath = require('app-root-path');

async function getUpload(req, res) {
    const userFolders = await prisma.resource.findMany({
        where: {
            AND: [{ ownerId: req.user.id }, { resource_type: "FOLDER" }]
        }
    })
    res.render('upload', { user: req.user, folders: userFolders || null });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        filePath = `${appRootPath}/uploads/${req.user.id}`;

        cb(null, filePath);
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniquePrefix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

async function postUpload(req, res) {
    // totalBytes / (1024*1024)
    if (!req.file) {
        res.status(400).redirect('/upload');
        return
    }

    console.log(`${req.file.destination}/${req.body.folder}/${req.file.filename}`);

    const sizeInMB = parseFloat((req.file.size / (1024 * 1024)).toFixed(2));
    await prisma.resource.create({
        data: {
            path: `${req.file.destination}${req.body.folder ? `/${req.body.folder}` : ''}/${req.file.filename}`,
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