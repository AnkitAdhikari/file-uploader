const prisma = require("../db/prismaClient")
const fs = require("node:fs");

async function getAllResources(req, res) {
    const result = await prisma.resource.findMany({
        where: {
            ownerId: req.user.id,
        }
    })
    return result
}

async function getFileById(req, res) {
    const { id } = req.params;
    const fileInfo = await prisma.resource.findUnique({
        where: {
            id: id,
        }
    })
    console.log(fileInfo);
    res.render('file', { pageTitle: fileInfo.name, file: fileInfo });
}


async function deleteFileById(req, res) {
    const { id } = req.params;

    const hasFile = await prisma.resource.findUnique({
        where: {
            id: id,
        }
    })

    if (hasFile) {
        console.log(hasFile);
        fs.unlink(hasFile.path, (err) => {
            if (err) {
                console.error(`Error removing file: ${err}`);
                return;
            }
        })
        await prisma.resource.delete({
            where: {
                id: id,
            }
        })
    }
    res.redirect('/')
}

async function downloadFile(req, res) {
    const { id } = req.params;
    const filePath = await prisma.resource.findUnique({
        where: {
            id: id,
        },
        select: {
            path: true,
            name: true
        }
    })

    console.log(filePath);
    res.download(filePath.path, filePath.name);
}

async function updateFile(req, res) {
    const { id } = req.params;
    const { filename } = req.body;

    if (!filename) return;

    console.log("before update");
    await prisma.resource.update({
        data: {
            name: filename
        },
        where: {
            id: id,
        }
    })
    res.redirect(req.get('referer'));
}

module.exports = {
    getAllResources,
    getFileById,
    deleteFileById,
    downloadFile,
    updateFile
}