import { Router } from "express";
import {
    downloadFile,
    uploadImage,
    downloadImage
} from "../controllers/media.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'
import multer from "multer"
const storage = multer.memoryStorage();
const upload = multer({ storage });


const router = Router();

router.get("/excel", verifyToken, downloadFile);
router.post("/uploadImage", verifyToken, upload.single('file'), uploadImage);
router.get("/image/:name", verifyToken, downloadImage);




export default router;