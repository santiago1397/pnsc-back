import { Router } from "express";
import {
    downloadFile,
} from "../controllers/media.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'


const router = Router();

router.get("/excel", verifyToken, downloadFile);



export default router;