import { Router } from "express";
import {
    getGeneralReport,
    getDatabase,
    getWeekReport,
} from "../controllers/reports.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'


const router = Router();

router.get("/report/general", verifyToken, getGeneralReport);
router.get("/report/db", /* verifyToken, */ getDatabase);
/* router.get("/report/general", verifyToken, getWeekReport); */


export default router;