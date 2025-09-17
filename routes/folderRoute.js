const { Router } = require("express");
const folderController = require("../controllers/folderController");

const routes = Router();

routes.get("/", folderController.getFolders);
routes.post("/", folderController.createFolder);

routes.get("/:id", folderController.getFolder);
routes.post("/:id/update", folderController.updateFolder);
routes.post("/:id/delete", folderController.deleteFolder);

routes.post("/:id/files", upload.single("file"), fileController.uploadFile);
routes.post("/:folderId/files/:fileId/delete", fileController.deleteFile);

module.exports = routes;