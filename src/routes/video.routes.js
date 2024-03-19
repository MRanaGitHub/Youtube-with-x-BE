import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getAllVideos, uploadVideos } from "../controllers/video.controller.js";

const router = Router();

router.route("/").get(getAllVideos);

router.route("/upload-video").post(
  verifyJwt,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideos
);

export default router;
