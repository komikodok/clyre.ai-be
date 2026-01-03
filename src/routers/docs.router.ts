
import { Router } from "express";
import rescue from "express-rescue";
import DocsController from "../controllers/docs.controller";
import { uploadFile } from "../middlewares/upload.middleware"; // Reusing existing multer config for now

const docsRouter = Router({ mergeParams: true });

docsRouter.post("/", uploadFile.single('document'), rescue(DocsController.upload));

export default docsRouter;
