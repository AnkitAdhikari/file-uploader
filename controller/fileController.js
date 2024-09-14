const prisma = require("../db/prismaClient")

async function getAllFiles(req, res) {
    const result = await prisma.resource.findMany({
        where: {
            ownerId: req.user.id,
        }
    })
    return result
}

module.exports = {
    getAllFiles
}