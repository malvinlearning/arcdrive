const { Router } = require("express");
const folderController = require("../controllers/folderController");
const fileController = require("../controllers/fileController");
const multer = require("multer");
const path = require("path");

// Storage config for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // store files in /uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const routes = Router();

routes.get("/", folderController.getFolders);
routes.post("/", folderController.createFolder);

routes.get("/:id", folderController.getFolder);
routes.post("/:id/update", folderController.updateFolder);
routes.post("/:id/delete", folderController.deleteFolder);

routes.post("/:id/files", upload.single("file"), fileController.uploadFile);
routes.post("/:folderId/files/:fileId/delete", fileController.deleteFile);

module.exports = routes;