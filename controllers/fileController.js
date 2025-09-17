const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

module.exports = {
    uploadFile: async (req, res) => {
        const folder = await prisma.folder.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (!folder || folder.userId !== req.user.id) {
            return res.status(403).send("Unauthorized");
        }

        await prisma.file.create({
            data: {
                name: req.file.originalname,
                path: req.file.path,
                size: req.file.size,
                folderId: folder.id,
            },
        });

        res.redirect(`/folders/${folder.id}`);
    },

    deleteFile: async (req, res) => {
        const { folderId, fileId } = req.params;
        const file = await prisma.file.findUnique({
            where: { id: Number(fileId) },
            include: { Folder: true },
        });
        if (!file || file.Folder.userId !== req.user.id) {
            return res.status(403).send("Unauthorized");
        }

        await prisma.file.delete({ where: { id: file.id } });
        res.redirect(`/folders/${folderId}`);
    },
};