import { Router } from "express";
import {
    getGeneralReport,
    getDatabase,
    getWeekReport,
    getYearlyReport,
    getStateReport,
    getRepeatedStudentReport,
    searchStudent
} from "../controllers/reports.controller.js";

import { verifyToken } from '../middlewares/auth.middleware.js'


const router = Router();

router.get("/report/general/:entity", verifyToken, getGeneralReport);
router.get("/report/db", verifyToken, getDatabase);
router.get("/report/yearly/:entity", verifyToken, getYearlyReport);
router.get("/report/state/:entity", verifyToken, getStateReport);
router.get("/report/repeated/:entity", verifyToken, getRepeatedStudentReport);
router.get("/report/students/:searchTerm", /* verifyToken, */ searchStudent);
/* router.get("/report/general", verifyToken, getWeekReport); */


export default router;