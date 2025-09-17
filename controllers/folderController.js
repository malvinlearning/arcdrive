const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

module.exports = {
    getFolders: async (req, res) => {
        if (!req.user) return res.redirect("/login");
        const folders = await prisma.folder.findMany({
            where: {userId: req.user.id},
            include: {files: true},
            orderBy: { createdAt: "desc" },
        });
        res.render("folders", { user: req.user, folders });
    },

    createFolder: async (req, res) => {
        if (!req.user) return res.redirect("/login");
        await prisma.folder.create({
            data: {name: req.body.name, userId: req.user.id}
        });
        res.redirect("/folders");
    },

    getFolder: async (req, res) => {
        const folder = await prisma.folder.findUnique({
            where: {id: Number(req.params.id)},
            include: { files: true },
        });
        if (!folder || folder.userId !== req.user.id) {
            return res.status(403).send("Unauthorized");
        };
        res.render("folderDetail", { user: req.user, folder });
    },

    updateFolder: async (req, res) => {
        const folder = await prisma.folder.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (!folder || folder.userId !== req.user.id) {
            return res.status(403).send("Unauthorized");
        }
        await prisma.folder.update({
            where: { id: folder.id },
            data: { name: req.body.name },
        });
        res.redirect("/folders");
    },

    deleteFolder: async (req, res) => {
        const folder = await prisma.folder.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (!folder || folder.userId !== req.user.id) {
            return res.status(403).send("Unauthorized");
        }
        await prisma.folder.delete({ where: { id: folder.id } });
        res.redirect("/folders");
    },
}