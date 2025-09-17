const { Router } = require("express");
const folderController = require("../controllers/folderController");
const fileController = require("../controllers/fileController");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "auto";

    // Explicitly set "raw" for non-images
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      resourceType = "raw";
    }

    return {
      folder: "user_uploads",
      allowed_formats: ["jpg", "png", "pdf", "docx"],
      resource_type: resourceType,
    };
  },
});


const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

const routes = Router();

routes.get("/", folderController.getFolders);
routes.post("/", folderController.createFolder);

routes.get("/:id", folderController.getFolder);
routes.post("/:id/update", folderController.updateFolder);
routes.post("/:id/delete", folderController.deleteFolder);

routes.post("/:id/files", upload.single("file"), fileController.uploadFile);
routes.post("/:folderId/files/:fileId/delete", fileController.deleteFile);

routes.get("/:folderId/files/:fileId", fileController.getFileDetails);
routes.get("/:folderId/files/:fileId/download", fileController.downloadFile);


module.exports = routes;