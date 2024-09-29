const appRootPath = require("app-root-path");
const prisma = require("../db/prismaClient");

function getNewFolder(req, res) {
    res.render('newFolder.ejs');
}

async function postNewFolder(req, res) {
    console.log(req.user);
    console.log(req.body);
    const { folderName } = req.body;
    const result = await prisma.resource.findFirst({
        where: {
            name: req.body.folderName,
        }
    })
    if (result) {
        res.redirect('/folder');
        return
    }
    await prisma.resource.create({
        data: {
            name: folderName,
            resource_type: "FOLDER",
            path: `${appRootPath}/${folderName}`,
            ownerId: req.user.id
        }
    })
    res.redirect('/');
}

async function getFolder(req, res) {

    const { id } = req.params

    let files = await prisma.resource.findMany({
        where: {
            path: {
                contains: id
            }
        }
    })
    res.render('folder', { pageTitle: 'Your folder', resources: files });
}

module.exports = {
    getNewFolder,
    postNewFolder,
    getFolder
}