const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const axios = require("axios");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
module.exports = {
    uploadFile: async (req, res) => {
        const folder = await prisma.folder.findUnique({
            where: { id: Number(req.params.id) },
        });

        if (!folder || folder.userId !== req.user.id) {
            return res.status(403).send("Unauthorized");
        }
        const fileUrl = req.file.secure_url || req.file.path || req.file.url;
        await prisma.file.create({
            data: {
                name: req.file.originalname,
                path: fileUrl,
                size: req.file.size,       
                folderId: folder.id,
                publicId: req.file.filename || req.file.public_id,
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

        // delete from Cloudinary first
        await cloudinary.uploader.destroy(file.publicId, {
            resource_type: "raw" // or "image" depending on file
        });

        // then delete from DB
        await prisma.file.delete({ where: { id: file.id } });

        res.redirect(`/folders/${folderId}`);
    },

    getFileDetails: async (req, res) => {
        const { folderId, fileId } = req.params;

        const file = await prisma.file.findUnique({
            where: { id: Number(fileId) },
            include: { Folder: true },
        });

        if (!file || file.Folder.userId !== req.user.id) {
            return res.status(403).send("Unauthorized");
        }

        res.render("fileDetail", { user: req.user, file, folderId });
    },

   

downloadFile: async (req, res) => {
    const { folderId, fileId } = req.params;

    // Fetch file record
    const file = await prisma.file.findUnique({
        where: { id: Number(fileId) },
        include: { Folder: true },
    });

    if (!file || file.Folder.userId !== req.user.id) {
        return res.status(403).send("Unauthorized");
    }

    // Option 1: Use Cloudinary URL directly (opens in browser)
    // res.redirect(file.path);

    // Option 2: Force download via streaming (works for PDFs/docs too)
    try {
        const response = await axios({
            url: file.path,        // the actual Cloudinary URL
            method: "GET",
            responseType: "stream",
        });

        // Set headers so browser downloads instead of opening
        res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
        res.setHeader("Content-Type", response.headers["content-type"]);

        response.data.pipe(res); // stream the file to the client
    } catch (err) {
        console.error("Download failed:", err);
        res.status(500).send("Error downloading file");
    }
}


};