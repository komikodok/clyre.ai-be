import { Router } from "express";
import rescue from "express-rescue";
import DocsController from "../controllers/docs.controller";
import {
  uploadFile,
  uploadToCloudinary,
} from "../middlewares/upload.middleware";

const docsRouter = Router({ mergeParams: true });

docsRouter.post(
  "/",
  uploadFile.single("document"),
  uploadToCloudinary,
  rescue(DocsController.upload),
);

export default docsRouter;
